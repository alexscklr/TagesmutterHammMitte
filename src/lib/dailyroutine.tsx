import type { JSX } from 'react'
import { supabase } from '../supabaseClient'

export interface DailyRoutineEntry {
    id: number
    start_time: string
    end_time: string
    label: string
    title: string
    description: string[]
    image_urls: string[]
}

export interface TimelineEntry {
    time: string
    timeSpan: [string, string]
    title: string
    description: JSX.Element
}

export async function fetchDailyRoutine(): Promise<TimelineEntry[]> {
    const { data, error } = await supabase
        .from('dailyroutine')
        .select('*')
        .order('start_time', { ascending: true }) as { data: DailyRoutineEntry[] | null, error: any };
 
 
    if (error) {
        console.error('Fehler beim Laden der Timeline:', error.message);
        return [];
    }
    if (!data) {
        return [];
    }

    const entries: TimelineEntry[] = data.map((dEntry) => {
        const start = dEntry.start_time.substring(0, 5);
        const end = dEntry.end_time.substring(0, 5);
 
        let imgWidth;
        const length: number = dEntry.image_urls.length;
        if (length == 1) imgWidth = "61%";
        else if (length >= 2) imgWidth = "39%"
        const entry: TimelineEntry = {
            time: dEntry.label,
            timeSpan: [start, end] as [string, string],
            title: dEntry.title,
            description: (
                <>
                    <div>
                        {dEntry.description.map((e, index) => {
                            return (<p key={index}>{e}</p>)
                        })}
                    </div>
                    {length >= 0 && (
                        <div style={{ display: "flex" }}>
                            {length == 1 && (<img src={dEntry.image_urls[0]} width={imgWidth} />)}
                            {length == 2 && (
                                <>
                                    <img src={dEntry.image_urls[0]} width={imgWidth} style={{ margin: "2%" }} />
                                    <img src={dEntry.image_urls[1]} width={imgWidth} style={{ margin: "2%" }} />
                                </>
                            )}
                        </div>
                    )}
                </>
            )
        }
        return entry;
    });
    return entries;
    
}
