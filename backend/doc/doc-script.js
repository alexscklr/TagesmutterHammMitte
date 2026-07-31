







var sidebarVisible = (window.localStorage && window.localStorage.docker_showSidebar) ?
                        window.localStorage.docker_showSidebar == 'yes' :
                        defaultSidebar;

 
function makeTree(treeData, root, filename) {
  var treeNode = document.getElementById('tree');
  var treeHandle = document.getElementById('sidebar-toggle');
  treeHandle.addEventListener('click', toggleTree, false);

  
  treeNode.innerHTML = nodeHtml('', treeData, '', root);

  
  treeNode.childNodes[0].className += ' open';

  
  treeNode.addEventListener('click', nodeClicked, false);

  if (sidebarVisible) document.body.className += ' sidebar';

  
  if (window.localStorage && window.localStorage.docker_treeScroll) treeNode.scrollTop = window.localStorage.docker_treeScroll;
  treeNode.onscroll = treeScrolled;

  
  setTimeout(function() { document.body.className += ' slidey'; }, 100);
}

 
function treeScrolled() {
  var tree = document.getElementById('tree');
  if (window.localStorage) window.localStorage.docker_treeScroll = tree.scrollTop;
}


function nodeClicked(e) {
  
  var t = e.target;

  
  if (t.tagName.toLowerCase() !== 'div' || t.className === 'children') return;

  
  while (t && t.className.substring(0, 3) != 'dir') t = t.parentNode;

  
  if (!t || t.parentNode.id == 'tree') return;

  
  var path = t.getAttribute('rel');
  if (t.className.indexOf('open') !== -1) {
    t.className = t.className.replace(/\s*open/g, '');
    if (window.localStorage) window.localStorage.removeItem('docker_openPath:' + path);
  } else {
    t.className += ' open';
    if (window.localStorage) window.localStorage['docker_openPath:' + path] = 'yes';
  }
}


 
function nodeHtml(nodename, node, path, root) {
  
  var isOpen = window.localStorage && window.localStorage['docker_openPath:' + path] == 'yes';
  var out = '<div class="dir' + (isOpen ? ' open' : '') + '" rel="' + path + '">';
  out += '<div class="nodename">' + nodename + '</div>';
  out += '<div class="children">';

  
  if (node.dirs) {
    var dirs = [];
    for (var i in node.dirs) {
      if (node.dirs.hasOwnProperty(i)) dirs.push({ name: i, html: nodeHtml(i, node.dirs[i], path + i + '/', root) });
    }
    
    dirs.sort(function(a, b) { return (a.name > b.name) ? 1 : (a.name == b.name) ? 0 : -1; });

    for (var k = 0; k < dirs.length; k += 1) out += dirs[k].html;
  }

  
  if (node.files) {
    node.files.sort();
    for (var j = 0; j < node.files.length; j += 1) {
      out += '<a class="file" href="' + root + path + node.files[j] + '.html">' + node.files[j] + '</a>';
    }
  }

  
  out += '</div></div>';

  return out;
}

 
function toggleTree() {
  
  if (sidebarVisible) {
    document.body.className = document.body.className.replace(/\s*sidebar/g, '');
    sidebarVisible = false;
  } else {
    document.body.className += ' sidebar';
    sidebarVisible = true;
  }
  if (window.localStorage) {
    if (sidebarVisible) {
      window.localStorage.docker_showSidebar = 'yes';
    } else {
      window.localStorage.docker_showSidebar = 'no';
    }
  }
}

 
function wireUpTabs() {
  var tabEl = document.getElementById('sidebar_switch');
  var children = tabEl.childNodes;

  
  for (var i = 0, l = children.length; i < l; i += 1) {
    
    if (children[i].nodeType !== 1) continue;
    children[i].addEventListener('click', function(c) {
      return function() { switchTab(c); };
    }(children[i].className));
  }
}

 
function switchTab(tab) {
  var tabEl = document.getElementById('sidebar_switch');
  var children = tabEl.childNodes;

  
  for (var i = 0, l = children.length; i < l; i += 1) {
    
    if (children[i].nodeType !== 1) continue;

    
    var t = children[i].className.replace(/\s.*$/, '');
    if (t === tab) {
      
      document.getElementById(t).style.display = 'block';
      if (children[i].className.indexOf('selected') === -1) children[i].className += ' selected';
    } else {
      
      document.getElementById(t).style.display = 'none';
      children[i].className = children[i].className.replace(/\sselected/, '');
    }
  }

  
  if (window.localStorage) window.localStorage.docker_sidebarTab = tab;
}

 
(function(init) {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', init);
  } else { 
    window.onload = init;
  }
}(function() {
  makeTree(tree, relativeDir, thisFile);
  wireUpTabs();

  
  if (window.localStorage && window.localStorage.docker_sidebarTab) {
    switchTab(window.localStorage.docker_sidebarTab);
  } else {
    switchTab('tree');
  }
}));
