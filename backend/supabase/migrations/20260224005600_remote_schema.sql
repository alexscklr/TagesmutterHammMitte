


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."delete_page_block_and_reorder"("p_block_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_page_id UUID;
  v_parent_id UUID;
  v_order INT;
BEGIN
  -- 1. Informationen des zu löschenden Blocks speichern
  SELECT page_id, parent_block_id, "order"
  INTO v_page_id, v_parent_id, v_order
  FROM page_blocks
  WHERE id = p_block_id;

  -- Falls der Block nicht existiert, abbrechen
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- 2. Den Block löschen
  DELETE FROM page_blocks
  WHERE id = p_block_id;

  -- 3. Alle nachfolgenden Blöcke aufrücken lassen
  -- Wir nutzen die gleichen NULL-Checks wie beim Insert
  UPDATE page_blocks
  SET "order" = "order" - 1
  WHERE page_id = v_page_id
    AND (
      (v_parent_id IS NULL AND parent_block_id IS NULL) 
      OR (parent_block_id = v_parent_id)
    )
    AND "order" > v_order;

END;
$$;


ALTER FUNCTION "public"."delete_page_block_and_reorder"("p_block_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_review_token"("p_days_valid" integer DEFAULT 30) RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_new_token TEXT;
BEGIN
  -- Generiert eine zufällige Zeichenfolge (z.B. 'a1b2c3d4...')
  v_new_token := encode(gen_random_bytes(16), 'hex');

  INSERT INTO public.review_tokens (token, expires_at)
  VALUES (v_new_token, now() + (p_days_valid || ' days')::interval);

  RETURN v_new_token;
END;
$$;


ALTER FUNCTION "public"."generate_review_token"("p_days_valid" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."page_blocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text",
    "order" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "jsonb",
    "parent_block_id" "uuid"
);


ALTER TABLE "public"."page_blocks" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_timeline_entries"("p_page_id" "uuid") RETURNS SETOF "public"."page_blocks"
    LANGUAGE "sql"
    AS $$
  SELECT *
  FROM page_blocks
  WHERE page_id = p_page_id
    AND type = 'timelineentry'
    AND to_timestamp(content->'timeSpan'->>0, 'HH24:MI:SS')::time <= now()::time
    AND to_timestamp(content->'timeSpan'->>1, 'HH24:MI:SS')::time >  now()::time
  ORDER BY "order"
  LIMIT 1;
$$;


ALTER FUNCTION "public"."get_current_timeline_entries"("p_page_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_page_block_and_reorder"("p_page_id" "uuid", "p_type" "text", "p_content" "jsonb", "p_order" integer, "p_parent_block_id" "uuid" DEFAULT NULL::"uuid") RETURNS SETOF "public"."page_blocks"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- 1. Alle existierenden Blöcke, die die gleiche parent_block_id haben
  -- und deren 'order' >= dem neuen p_order ist, um 1 nach hinten schieben.
  UPDATE page_blocks
  SET "order" = "order" + 1
  WHERE page_id = p_page_id
    AND (
      (p_parent_block_id IS NULL AND parent_block_id IS NULL) 
      OR (parent_block_id = p_parent_block_id)
    )
    AND "order" >= p_order;

  -- 2. Den neuen Block an der frei gewordenen Stelle einfügen.
  RETURN QUERY
  INSERT INTO page_blocks (page_id, type, content, "order", parent_block_id)
  VALUES (p_page_id, p_type, p_content, p_order, p_parent_block_id)
  RETURNING *;
END;
$$;


ALTER FUNCTION "public"."insert_page_block_and_reorder"("p_page_id" "uuid", "p_type" "text", "p_content" "jsonb", "p_order" integer, "p_parent_block_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Hier anpassen: Ich gehe davon aus, dass deine Rollen in einer Tabelle 'profiles'
  -- oder 'user_roles' stehen. Beispiel für eine Tabelle 'profiles':
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."protect_static_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Prüfen, ob die Seite statisch ist UND ob der Slug geändert wurde
  IF OLD.is_static = true AND NEW.slug IS DISTINCT FROM OLD.slug THEN
    RAISE EXCEPTION 'Der Slug einer statischen Seite kann nicht geändert werden.';
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."protect_static_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_review"("p_token" "text", "p_author_name" "text", "p_rating" integer, "p_comment" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_token_id UUID;
BEGIN
  -- 1. Token suchen, das noch nicht benutzt wurde und nicht abgelaufen ist
  SELECT id INTO v_token_id
  FROM public.review_tokens
  WHERE token = p_token 
    AND is_used = false 
    AND (expires_at IS NULL OR expires_at > now())
  FOR UPDATE; -- Zeile sperren für atomaren Zugriff

  -- 2. Wenn kein gültiges Token gefunden wurde, Fehler werfen
  IF v_token_id IS NULL THEN
    RAISE EXCEPTION 'Ungültiges oder bereits verwendetes Token.';
  END IF;

  -- 3. Rezension in die reviews Tabelle schreiben
  INSERT INTO public.reviews (author_name, rating, comment)
  VALUES (p_author_name, p_rating, p_comment);

  -- 4. Token als benutzt markieren
  UPDATE public.review_tokens
  SET is_used = true
  WHERE id = v_token_id;

END;
$$;


ALTER FUNCTION "public"."submit_review"("p_token" "text", "p_author_name" "text", "p_rating" integer, "p_comment" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."footer_blocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" DEFAULT ''::"text" NOT NULL,
    "content" "jsonb",
    "parent_block_id" "uuid",
    "target_site_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "order" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."footer_blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."header_blocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" DEFAULT 'link'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "order" integer DEFAULT 1,
    "parent_block_id" "uuid",
    "target_site_id" "uuid"
);


ALTER TABLE "public"."header_blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text",
    "sitetitle" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "background" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "is_static" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_public" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "is_admin" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'User Profiles (e.g. roles)';



CREATE TABLE IF NOT EXISTS "public"."review_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "token" "text" DEFAULT ''::"text" NOT NULL,
    "is_used" boolean DEFAULT false NOT NULL,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."review_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_name" "text" DEFAULT ''::"text" NOT NULL,
    "rating" smallint DEFAULT '5'::smallint NOT NULL,
    "comment" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


ALTER TABLE ONLY "public"."footer_blocks"
    ADD CONSTRAINT "footer_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."header_blocks"
    ADD CONSTRAINT "header_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."page_blocks"
    ADD CONSTRAINT "page_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_tokens"
    ADD CONSTRAINT "review_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



CREATE INDEX "header_blocks_created_at_idx" ON "public"."header_blocks" USING "btree" ("created_at");



CREATE INDEX "header_blocks_order_idx" ON "public"."header_blocks" USING "btree" ("order");



CREATE INDEX "header_blocks_order_idx1" ON "public"."header_blocks" USING "btree" ("order");



CREATE INDEX "header_blocks_parent_block_id_idx" ON "public"."header_blocks" USING "btree" ("parent_block_id");



CREATE INDEX "header_blocks_target_site_id_idx" ON "public"."header_blocks" USING "btree" ("target_site_id");



CREATE INDEX "header_blocks_type_idx" ON "public"."header_blocks" USING "btree" ("type");



CREATE INDEX "page_blocks_page_id_idx" ON "public"."page_blocks" USING "btree" ("page_id");



CREATE INDEX "page_blocks_type_idx" ON "public"."page_blocks" USING "btree" ("type");



CREATE OR REPLACE TRIGGER "trigger_protect_static_slug" BEFORE UPDATE ON "public"."pages" FOR EACH ROW EXECUTE FUNCTION "public"."protect_static_slug"();



ALTER TABLE ONLY "public"."footer_blocks"
    ADD CONSTRAINT "footer_blocks_parent_block_id_fkey" FOREIGN KEY ("parent_block_id") REFERENCES "public"."footer_blocks"("id");



ALTER TABLE ONLY "public"."footer_blocks"
    ADD CONSTRAINT "footer_blocks_target_site_id_fkey" FOREIGN KEY ("target_site_id") REFERENCES "public"."pages"("id");



ALTER TABLE ONLY "public"."header_blocks"
    ADD CONSTRAINT "header_blocks_parent_block_id_fkey" FOREIGN KEY ("parent_block_id") REFERENCES "public"."header_blocks"("id");



ALTER TABLE ONLY "public"."header_blocks"
    ADD CONSTRAINT "header_blocks_target_site_id_fkey" FOREIGN KEY ("target_site_id") REFERENCES "public"."pages"("id");



ALTER TABLE ONLY "public"."page_blocks"
    ADD CONSTRAINT "page_blocks_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id");



ALTER TABLE ONLY "public"."page_blocks"
    ADD CONSTRAINT "page_blocks_parent_block_id_fkey" FOREIGN KEY ("parent_block_id") REFERENCES "public"."page_blocks"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey1" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin can delete" ON "public"."reviews" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admin can do all" ON "public"."page_blocks" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage all profiles" ON "public"."profiles" TO "authenticated" USING (("is_admin" = true)) WITH CHECK (("is_admin" = true));



CREATE POLICY "Admins dürfen (non_static) Seiten löschen" ON "public"."pages" FOR DELETE TO "authenticated" USING (("public"."is_admin"() AND ("is_static" = true)));



CREATE POLICY "Admins dürfen Footer-Blöcke bearbeiten" ON "public"."footer_blocks" FOR UPDATE USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins dürfen Footer-Blöcke erstellen" ON "public"."footer_blocks" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins dürfen Footer-Blöcke löschen" ON "public"."footer_blocks" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "Admins dürfen Header-Blöcke bearbeiten" ON "public"."header_blocks" FOR UPDATE USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins dürfen Header-Blöcke erstellen" ON "public"."header_blocks" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins dürfen Header-Blöcke löschen" ON "public"."header_blocks" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "Admins dürfen Seiten bearbeiten" ON "public"."pages" FOR UPDATE USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins dürfen Seiten erstellen" ON "public"."pages" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Enable read access for all users" ON "public"."page_blocks" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."pages" FOR SELECT USING (("is_public" OR "public"."is_admin"()));



CREATE POLICY "Footer-Blöcke sind öffentlich lesbar" ON "public"."footer_blocks" FOR SELECT USING (true);



CREATE POLICY "Header-Blöcke sind öffentlich lesbar" ON "public"."header_blocks" FOR SELECT USING (true);



CREATE POLICY "Jeder kann Token prüfen" ON "public"."review_tokens" FOR SELECT USING (true);



CREATE POLICY "Nur Admins erstellen Tokens" ON "public"."review_tokens" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Nur Admins verwalten Tokens" ON "public"."review_tokens" USING ("public"."is_admin"());



CREATE POLICY "Rezensionen sind öffentlich sichtbar" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "Users can read their own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."footer_blocks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."header_blocks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_blocks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."review_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





























































































































































































GRANT ALL ON FUNCTION "public"."delete_page_block_and_reorder"("p_block_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_page_block_and_reorder"("p_block_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_page_block_and_reorder"("p_block_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_review_token"("p_days_valid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."generate_review_token"("p_days_valid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_review_token"("p_days_valid" integer) TO "service_role";



GRANT ALL ON TABLE "public"."page_blocks" TO "anon";
GRANT ALL ON TABLE "public"."page_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."page_blocks" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_timeline_entries"("p_page_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_timeline_entries"("p_page_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_timeline_entries"("p_page_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_page_block_and_reorder"("p_page_id" "uuid", "p_type" "text", "p_content" "jsonb", "p_order" integer, "p_parent_block_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_page_block_and_reorder"("p_page_id" "uuid", "p_type" "text", "p_content" "jsonb", "p_order" integer, "p_parent_block_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_page_block_and_reorder"("p_page_id" "uuid", "p_type" "text", "p_content" "jsonb", "p_order" integer, "p_parent_block_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."protect_static_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."protect_static_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."protect_static_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."submit_review"("p_token" "text", "p_author_name" "text", "p_rating" integer, "p_comment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."submit_review"("p_token" "text", "p_author_name" "text", "p_rating" integer, "p_comment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_review"("p_token" "text", "p_author_name" "text", "p_rating" integer, "p_comment" "text") TO "service_role";
























GRANT ALL ON TABLE "public"."footer_blocks" TO "anon";
GRANT ALL ON TABLE "public"."footer_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."footer_blocks" TO "service_role";



GRANT ALL ON TABLE "public"."header_blocks" TO "anon";
GRANT ALL ON TABLE "public"."header_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."header_blocks" TO "service_role";



GRANT ALL ON TABLE "public"."pages" TO "anon";
GRANT ALL ON TABLE "public"."pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."review_tokens" TO "anon";
GRANT ALL ON TABLE "public"."review_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."review_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Admin full access il347i_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admin full access il347i_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admin full access il347i_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admin full access il347i_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow public read il347i_0"
  on "storage"."objects"
  as permissive
  for select
  to anon, authenticated
using ((bucket_id = 'public_images'::text));



