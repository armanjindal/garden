var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import sourceMapSupport from"source-map-support";import path12 from"path";import chalk from"chalk";import pretty from"pretty-time";var PerfTimer=class{static{__name(this,"PerfTimer")}evts;constructor(){this.evts={},this.addEvent("start")}addEvent(evtName){this.evts[evtName]=process.hrtime()}timeSince(evtName){return chalk.yellow(pretty(process.hrtime(this.evts[evtName??"start"])))}};import{rimraf}from"rimraf";import{isGitIgnored}from"globby";import chalk3 from"chalk";import esbuild from"esbuild";import remarkParse from"remark-parse";import remarkRehype from"remark-rehype";import{unified}from"unified";import{read}from"to-vfile";import{slug}from"github-slugger";var QUARTZ="quartz";function slugifyFilePath(fp,excludeExt){fp=_stripSlashes(fp);let ext=_getFileExtension(fp),withoutFileExt=fp.replace(new RegExp(ext+"$"),"");(excludeExt||[".md",".html",void 0].includes(ext))&&(ext="");let slug2=withoutFileExt.split("/").map(segment=>segment.replace(/\s/g,"-").replace(/%/g,"-percent")).join("/").replace(/\/$/,"");return _endsWith(slug2,"_index")&&(slug2=slug2.replace(/_index$/,"index")),slug2+ext}__name(slugifyFilePath,"slugifyFilePath");function simplifySlug(fp){return _stripSlashes(_trimSuffix(fp,"index"),!0)}__name(simplifySlug,"simplifySlug");function transformInternalLink(link){let[fplike,anchor]=splitAnchor(decodeURI(link)),folderPath=_isFolderPath(fplike),segments=fplike.split("/").filter(x=>x.length>0),prefix=segments.filter(_isRelativeSegment).join("/"),fp=segments.filter(seg=>!_isRelativeSegment(seg)&&seg!=="").join("/"),simpleSlug=simplifySlug(slugifyFilePath(fp)),joined=joinSegments(_stripSlashes(prefix),_stripSlashes(simpleSlug)),trail=folderPath?"/":"";return _addRelativeToStart(joined)+trail+anchor}__name(transformInternalLink,"transformInternalLink");function pathToRoot(slug2){let rootPath=slug2.split("/").filter(x=>x!=="").slice(0,-1).map(_=>"..").join("/");return rootPath.length===0&&(rootPath="."),rootPath}__name(pathToRoot,"pathToRoot");function resolveRelative(current,target){return joinSegments(pathToRoot(current),simplifySlug(target))}__name(resolveRelative,"resolveRelative");function splitAnchor(link){let[fp,anchor]=link.split("#",2);return anchor=anchor===void 0?"":"#"+slugAnchor(anchor),[fp,anchor]}__name(splitAnchor,"splitAnchor");function slugAnchor(anchor){return slug(anchor)}__name(slugAnchor,"slugAnchor");function slugTag(tag){return tag.split("/").map(tagSegment=>slug(tagSegment)).join("/")}__name(slugTag,"slugTag");function joinSegments(...args){return args.filter(segment=>segment!=="").join("/")}__name(joinSegments,"joinSegments");function getAllSegmentPrefixes(tags){let segments=tags.split("/"),results=[];for(let i=0;i<segments.length;i++)results.push(segments.slice(0,i+1).join("/"));return results}__name(getAllSegmentPrefixes,"getAllSegmentPrefixes");function transformLink(src,target,opts){let targetSlug=transformInternalLink(target);if(opts.strategy==="relative")return targetSlug;{let folderTail=_isFolderPath(targetSlug)?"/":"",canonicalSlug=_stripSlashes(targetSlug.slice(1)),[targetCanonical,targetAnchor]=splitAnchor(canonicalSlug);if(opts.strategy==="shortest"){let matchingFileNames=opts.allSlugs.filter(slug2=>{let fileName=slug2.split("/").at(-1);return targetCanonical===fileName});if(matchingFileNames.length===1){let targetSlug2=matchingFileNames[0];return resolveRelative(src,targetSlug2)+targetAnchor}}return joinSegments(pathToRoot(src),canonicalSlug)+folderTail}}__name(transformLink,"transformLink");function _isFolderPath(fplike){return fplike.endsWith("/")||_endsWith(fplike,"index")||_endsWith(fplike,"index.md")||_endsWith(fplike,"index.html")}__name(_isFolderPath,"_isFolderPath");function _endsWith(s,suffix){return s===suffix||s.endsWith("/"+suffix)}__name(_endsWith,"_endsWith");function _trimSuffix(s,suffix){return _endsWith(s,suffix)&&(s=s.slice(0,-suffix.length)),s}__name(_trimSuffix,"_trimSuffix");function _getFileExtension(s){return s.match(/\.[A-Za-z0-9]+$/)?.[0]}__name(_getFileExtension,"_getFileExtension");function _isRelativeSegment(s){return/^\.{0,2}$/.test(s)}__name(_isRelativeSegment,"_isRelativeSegment");function _stripSlashes(s,onlyStripPrefix){return s.startsWith("/")&&(s=s.substring(1)),!onlyStripPrefix&&s.endsWith("/")&&(s=s.slice(0,-1)),s}__name(_stripSlashes,"_stripSlashes");function _addRelativeToStart(s){return s===""&&(s="."),s.startsWith(".")||(s=joinSegments(".",s)),s}__name(_addRelativeToStart,"_addRelativeToStart");import path from"path";import workerpool,{Promise as WorkerPromise}from"workerpool";import{Spinner}from"cli-spinner";var QuartzLogger=class{static{__name(this,"QuartzLogger")}verbose;spinner;constructor(verbose){this.verbose=verbose}start(text){this.verbose?console.log(text):(this.spinner=new Spinner(`%s ${text}`),this.spinner.setSpinnerString(18),this.spinner.start())}end(text){this.verbose||this.spinner.stop(!0),text&&console.log(text)}};import chalk2 from"chalk";import process2 from"process";import{isMainThread}from"workerpool";var rootFile=/.*at file:/;function trace(msg,err){let stack=err.stack,lines=[];if(lines.push(""),lines.push(`
`+chalk2.bgRed.black.bold(" ERROR ")+`
`+chalk2.red(` ${msg}`)+(err.message.length>0?`: ${err.message}`:"")),!stack)return;let reachedEndOfLegibleTrace=!1;for(let line of stack.split(`
`).slice(1)){if(reachedEndOfLegibleTrace)break;line.includes("node_modules")||(lines.push(` ${line}`),rootFile.test(line)&&(reachedEndOfLegibleTrace=!0))}let traceMsg=lines.join(`
`);if(isMainThread)console.error(traceMsg),process2.exit(1);else throw new Error(traceMsg)}__name(trace,"trace");function createProcessor(ctx){let transformers=ctx.cfg.plugins.transformers,processor=unified().use(remarkParse);for(let plugin of transformers.filter(p=>p.markdownPlugins))processor=processor.use(plugin.markdownPlugins(ctx));processor=processor.use(remarkRehype,{allowDangerousHtml:!0});for(let plugin of transformers.filter(p=>p.htmlPlugins))processor=processor.use(plugin.htmlPlugins(ctx));return processor}__name(createProcessor,"createProcessor");function*chunks(arr,n){for(let i=0;i<arr.length;i+=n)yield arr.slice(i,i+n)}__name(chunks,"chunks");async function transpileWorkerScript(){let cacheFile="./.quartz-cache/transpiled-worker.mjs",fp="./quartz/worker.ts";return esbuild.build({entryPoints:[fp],outfile:path.join(QUARTZ,cacheFile),bundle:!0,keepNames:!0,platform:"node",format:"esm",packages:"external",sourcemap:!0,sourcesContent:!1,plugins:[{name:"css-and-scripts-as-text",setup(build){build.onLoad({filter:/\.scss$/},_=>({contents:"",loader:"text"})),build.onLoad({filter:/\.inline\.(ts|js)$/},_=>({contents:"",loader:"text"}))}}]})}__name(transpileWorkerScript,"transpileWorkerScript");function createFileParser(ctx,fps){let{argv,cfg}=ctx;return async processor=>{let res=[];for(let fp of fps)try{let perf=new PerfTimer,file=await read(fp);file.value=file.value.toString().trim();for(let plugin of cfg.plugins.transformers.filter(p=>p.textTransform))file.value=plugin.textTransform(ctx,file.value);file.data.slug=slugifyFilePath(path.posix.relative(argv.directory,file.path)),file.data.filePath=fp;let ast=processor.parse(file),newAst=await processor.run(ast,file);res.push([newAst,file]),argv.verbose&&console.log(`[process] ${fp} -> ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process \`${fp}\``,err)}return res}}__name(createFileParser,"createFileParser");var clamp=__name((num,min,max)=>Math.min(Math.max(Math.round(num),min),max),"clamp");async function parseMarkdown(ctx,fps){let{argv}=ctx,perf=new PerfTimer,log=new QuartzLogger(argv.verbose),CHUNK_SIZE=128,concurrency=ctx.argv.concurrency??clamp(fps.length/CHUNK_SIZE,1,4),res=[];if(log.start(`Parsing input files using ${concurrency} threads`),concurrency===1)try{let processor=createProcessor(ctx);res=await createFileParser(ctx,fps)(processor)}catch(error){throw log.end(),error}else{await transpileWorkerScript();let pool=workerpool.pool("./quartz/bootstrap-worker.mjs",{minWorkers:"max",maxWorkers:concurrency,workerType:"thread"}),childPromises=[];for(let chunk of chunks(fps,CHUNK_SIZE))childPromises.push(pool.exec("parseFiles",[argv,chunk,ctx.allSlugs]));res=(await WorkerPromise.all(childPromises).catch(err=>{let errString=err.toString().slice(6);console.error(errString),process.exit(1)})).flat(),await pool.terminate()}return log.end(`Parsed ${res.length} Markdown files in ${perf.timeSince()}`),res}__name(parseMarkdown,"parseMarkdown");function filterContent(ctx,content){let{cfg,argv}=ctx,perf=new PerfTimer,initialLength=content.length;for(let plugin of cfg.plugins.filters){let updatedContent=content.filter(item=>plugin.shouldPublish(ctx,item));if(argv.verbose){let diff=content.filter(x=>!updatedContent.includes(x));for(let file of diff)console.log(`[filter:${plugin.name}] ${file[1].data.slug}`)}content=updatedContent}return console.log(`Filtered out ${initialLength-content.length} files in ${perf.timeSince()}`),content}__name(filterContent,"filterContent");import path11 from"path";import fs4 from"fs";import matter from"gray-matter";import remarkFrontmatter from"remark-frontmatter";import yaml from"js-yaml";import toml from"toml";var defaultOptions={delims:"---",language:"yaml"},FrontMatter=__name(userOpts=>{let opts={...defaultOptions,...userOpts};return{name:"FrontMatter",markdownPlugins(){return[[remarkFrontmatter,["yaml","toml"]],()=>(_,file)=>{let{data}=matter(file.value,{...opts,engines:{yaml:s=>yaml.load(s,{schema:yaml.JSON_SCHEMA}),toml:s=>toml.parse(s)}});data.tag&&(data.tags=data.tag),data.tags&&!Array.isArray(data.tags)&&(data.tags=data.tags.toString().split(",").map(tag=>tag.trim())),data.tags=[...new Set(data.tags?.map(tag=>slugTag(tag)))],file.data.frontmatter={title:file.stem??"Untitled",tags:[],...data}}]}}},"FrontMatter");import remarkGfm from"remark-gfm";import smartypants from"remark-smartypants";import rehypeSlug from"rehype-slug";import rehypeAutolinkHeadings from"rehype-autolink-headings";var defaultOptions2={enableSmartyPants:!0,linkHeadings:!0},GitHubFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions2,...userOpts};return{name:"GitHubFlavoredMarkdown",markdownPlugins(){return opts.enableSmartyPants?[remarkGfm,smartypants]:[remarkGfm]},htmlPlugins(){return opts.linkHeadings?[rehypeSlug,[rehypeAutolinkHeadings,{behavior:"append",content:{type:"text",value:" \xA7"}}]]:[]}}},"GitHubFlavoredMarkdown");import fs from"fs";import path2 from"path";import{Repository}from"@napi-rs/simple-git";var defaultOptions3={priority:["frontmatter","git","filesystem"]};function coerceDate(d){let dt=new Date(d);return isNaN(dt.getTime())?new Date:dt}__name(coerceDate,"coerceDate");var CreatedModifiedDate=__name(userOpts=>{let opts={...defaultOptions3,...userOpts};return{name:"CreatedModifiedDate",markdownPlugins(){return[()=>{let repo;return async(_tree,file)=>{let created,modified,published,fp=path2.posix.join(file.cwd,file.data.filePath);for(let source of opts.priority)if(source==="filesystem"){let st=await fs.promises.stat(fp);created||=st.birthtimeMs,modified||=st.mtimeMs}else source==="frontmatter"&&file.data.frontmatter?(created||=file.data.frontmatter.date,modified||=file.data.frontmatter.lastmod,modified||=file.data.frontmatter.updated,modified||=file.data.frontmatter["last-modified"],published||=file.data.frontmatter.publishDate):source==="git"&&(repo||(repo=new Repository(file.cwd)),modified||=await repo.getFileLatestModifiedDateAsync(file.data.filePath));file.data.dates={created:coerceDate(created),modified:coerceDate(modified),published:coerceDate(published)}}}]}}},"CreatedModifiedDate");import remarkMath from"remark-math";import rehypeKatex from"rehype-katex";import rehypeMathjax from"rehype-mathjax/svg.js";var Latex=__name(opts=>{let engine=opts?.renderEngine??"katex";return{name:"Latex",markdownPlugins(){return[remarkMath]},htmlPlugins(){return engine==="katex"?[[rehypeKatex,{output:"html"}]]:[rehypeMathjax]},externalResources(){return engine==="katex"?{css:["https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"],js:[{src:"https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/copy-tex.min.js",loadTime:"afterDOMReady",contentType:"external"}]}:{}}}},"Latex");import{toString}from"hast-util-to-string";var escapeHTML=__name(unsafe=>unsafe.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),"escapeHTML");var defaultOptions4={descriptionLength:150},Description=__name(userOpts=>{let opts={...defaultOptions4,...userOpts};return{name:"Description",htmlPlugins(){return[()=>async(tree,file)=>{let frontMatterDescription=file.data.frontmatter?.description,text=escapeHTML(toString(tree)),sentences=(frontMatterDescription??text).replace(/\s+/g," ").split("."),finalDesc="",sentenceIdx=0,len=opts.descriptionLength;for(;finalDesc.length<len;){let sentence=sentences[sentenceIdx];if(!sentence)break;finalDesc+=sentence+".",sentenceIdx++}file.data.description=finalDesc,file.data.text=text}]}}},"Description");import path3 from"path";import{visit}from"unist-util-visit";import isAbsoluteUrl from"is-absolute-url";var defaultOptions5={markdownLinkResolution:"absolute",prettyLinks:!0},CrawlLinks=__name(userOpts=>{let opts={...defaultOptions5,...userOpts};return{name:"LinkProcessing",htmlPlugins(ctx){return[()=>(tree,file)=>{let curSlug=simplifySlug(file.data.slug),outgoing=new Set,transformOptions={strategy:opts.markdownLinkResolution,allSlugs:ctx.allSlugs};visit(tree,"element",(node,_index,_parent)=>{if(node.tagName==="a"&&node.properties&&typeof node.properties.href=="string"){let dest=node.properties.href;node.properties.className??=[],node.properties.className.push(isAbsoluteUrl(dest)?"external":"internal");let isInternal=!(isAbsoluteUrl(dest)||dest.startsWith("#"));if(isInternal){dest=node.properties.href=transformLink(file.data.slug,dest,transformOptions);let canonicalDest=new URL(dest,`https://base.com/${curSlug}`).pathname,[destCanonical,_destAnchor]=splitAnchor(canonicalDest),simple=decodeURIComponent(simplifySlug(destCanonical));outgoing.add(simple)}opts.prettyLinks&&isInternal&&node.children.length===1&&node.children[0].type==="text"&&!node.children[0].value.startsWith("#")&&(node.children[0].value=path3.basename(node.children[0].value))}if(["img","video","audio","iframe"].includes(node.tagName)&&node.properties&&typeof node.properties.src=="string"&&!isAbsoluteUrl(node.properties.src)){let dest=node.properties.src;dest=node.properties.src=transformLink(file.data.slug,dest,transformOptions),node.properties.src=dest}}),file.data.links=[...outgoing]}]}}},"CrawlLinks");import{findAndReplace as mdastFindReplace}from"mdast-util-find-and-replace";import{slug as slugAnchor2}from"github-slugger";import rehypeRaw from"rehype-raw";import{visit as visit2}from"unist-util-visit";import path4 from"path";var callout_inline_default=`// quartz/components/scripts/quartz/components/scripts/callout.inline.ts
function toggleCallout() {
  const outerBlock = this.parentElement;
  outerBlock.classList.toggle(\`is-collapsed\`);
  const collapsed = outerBlock.classList.contains(\`is-collapsed\`);
  const height = collapsed ? this.scrollHeight : outerBlock.scrollHeight;
  outerBlock.style.maxHeight = height + \`px\`;
  let current = outerBlock;
  let parent = outerBlock.parentElement;
  while (parent) {
    if (!parent.classList.contains(\`callout\`)) {
      return;
    }
    const collapsed2 = parent.classList.contains(\`is-collapsed\`);
    const height2 = collapsed2 ? parent.scrollHeight : parent.scrollHeight + current.scrollHeight;
    parent.style.maxHeight = height2 + \`px\`;
    current = parent;
    parent = parent.parentElement;
  }
}
function setupCallout() {
  const collapsible = document.getElementsByClassName(
    \`callout is-collapsible\`
  );
  for (const div of collapsible) {
    const title = div.firstElementChild;
    if (title) {
      title.removeEventListener(\`click\`, toggleCallout);
      title.addEventListener(\`click\`, toggleCallout);
      const collapsed = div.classList.contains(\`is-collapsed\`);
      const height = collapsed ? title.scrollHeight : div.scrollHeight;
      div.style.maxHeight = height + \`px\`;
    }
  }
}
document.addEventListener(\`nav\`, setupCallout);
window.addEventListener(\`resize\`, setupCallout);
`;import{toHast}from"mdast-util-to-hast";import{toHtml}from"hast-util-to-html";var defaultOptions6={comments:!0,highlight:!0,wikilinks:!0,callouts:!0,mermaid:!0,parseTags:!0,enableInHtmlEmbed:!1},icons={infoIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',pencilIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>',clipboardListIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>',checkCircleIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',flameIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',checkIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',helpCircleIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',alertTriangleIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',xIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',zapIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',bugIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>',listIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',quoteIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>'},callouts={note:icons.pencilIcon,abstract:icons.clipboardListIcon,info:icons.infoIcon,todo:icons.checkCircleIcon,tip:icons.flameIcon,success:icons.checkIcon,question:icons.helpCircleIcon,warning:icons.alertTriangleIcon,failure:icons.xIcon,danger:icons.zapIcon,bug:icons.bugIcon,example:icons.listIcon,quote:icons.quoteIcon},calloutMapping={note:"note",abstract:"abstract",info:"info",todo:"todo",tip:"tip",hint:"tip",important:"tip",success:"success",check:"success",done:"success",question:"question",help:"question",faq:"question",warning:"warning",attention:"warning",caution:"warning",failure:"failure",missing:"failure",fail:"failure",danger:"danger",error:"danger",bug:"bug",example:"example",quote:"quote",cite:"quote"};function canonicalizeCallout(calloutName){let callout=calloutName.toLowerCase();return calloutMapping[callout]??calloutName}__name(canonicalizeCallout,"canonicalizeCallout");var capitalize=__name(s=>s.substring(0,1).toUpperCase()+s.substring(1),"capitalize"),wikilinkRegex=new RegExp(/!?\[\[([^\[\]\|\#]+)?(#[^\[\]\|\#]+)?(\|[^\[\]\|\#]+)?\]\]/,"g"),highlightRegex=new RegExp(/==([^=]+)==/,"g"),commentRegex=new RegExp(/%%(.+)%%/,"g"),calloutRegex=new RegExp(/^\[\!(\w+)\]([+-]?)/),calloutLineRegex=new RegExp(/^> *\[\!\w+\][+-]?.*$/,"gm"),tagRegex=new RegExp(/(?:^| )#((?:[-_\p{L}\d])+(?:\/[-_\p{L}\d]+)*)/,"gu"),ObsidianFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions6,...userOpts},mdastToHtml=__name(ast=>{let hast=toHast(ast,{allowDangerousHtml:!0});return toHtml(hast,{allowDangerousHtml:!0})},"mdastToHtml"),findAndReplace=opts.enableInHtmlEmbed?(tree,regex,replace)=>{replace&&visit2(tree,"html",node=>{typeof replace=="string"?node.value=node.value.replace(regex,replace):node.value=node.value.replaceAll(regex,(substring,...args)=>{let replaceValue=replace(substring,...args);return typeof replaceValue=="string"?replaceValue:Array.isArray(replaceValue)?replaceValue.map(mdastToHtml).join(""):typeof replaceValue=="object"&&replaceValue!==null?mdastToHtml(replaceValue):substring})}),mdastFindReplace(tree,regex,replace)}:mdastFindReplace;return{name:"ObsidianFlavoredMarkdown",textTransform(_ctx,src){return opts.callouts&&(src=src.toString(),src=src.replaceAll(calloutLineRegex,value=>value+`
> `)),opts.wikilinks&&(src=src.toString(),src=src.replaceAll(wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp??"",anchor=rawHeader?.trim().slice(1),displayAnchor=anchor?`#${slugAnchor2(anchor)}`:"",displayAlias=rawAlias??rawHeader?.replace("#","|")??"";return`${value.startsWith("!")?"!":""}[[${fp}${displayAnchor}${displayAlias}]]`})),src},markdownPlugins(){let plugins=[];return opts.wikilinks&&plugins.push(()=>(tree,_file)=>{findAndReplace(tree,wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp?.trim()??"",anchor=rawHeader?.trim()??"",alias=rawAlias?.slice(1).trim();if(value.startsWith("!")){let ext=path4.extname(fp).toLowerCase(),url2=slugifyFilePath(fp);if([".png",".jpg",".jpeg",".gif",".bmp",".svg"].includes(ext)){let dims=alias??"",[width,height]=dims.split("x",2);return width||="auto",height||="auto",{type:"image",url:url2,data:{hProperties:{width,height}}}}else{if([".mp4",".webm",".ogv",".mov",".mkv"].includes(ext))return{type:"html",value:`<video src="${url2}" controls></video>`};if([".mp3",".webm",".wav",".m4a",".ogg",".3gp",".flac"].includes(ext))return{type:"html",value:`<audio src="${url2}" controls></audio>`};if([".pdf"].includes(ext))return{type:"html",value:`<iframe src="${url2}"></iframe>`}}}return{type:"link",url:fp+anchor,children:[{type:"text",value:alias??fp}]}})}),opts.highlight&&plugins.push(()=>(tree,_file)=>{findAndReplace(tree,highlightRegex,(_value,...capture)=>{let[inner]=capture;return{type:"html",value:`<span class="text-highlight">${inner}</span>`}})}),opts.comments&&plugins.push(()=>(tree,_file)=>{findAndReplace(tree,commentRegex,(_value,..._capture)=>({type:"text",value:""}))}),opts.callouts&&plugins.push(()=>(tree,_file)=>{visit2(tree,"blockquote",node=>{if(node.children.length===0)return;let firstChild=node.children[0];if(firstChild.type!=="paragraph"||firstChild.children[0]?.type!=="text")return;let text=firstChild.children[0].value,restChildren=firstChild.children.slice(1),[firstLine,...remainingLines]=text.split(`
`),remainingText=remainingLines.join(`
`),match=firstLine.match(calloutRegex);if(match&&match.input){let[calloutDirective,typeString,collapseChar]=match,calloutType=canonicalizeCallout(typeString.toLowerCase()),collapse=collapseChar==="+"||collapseChar==="-",defaultState=collapseChar==="-"?"collapsed":"expanded",titleNode={type:"paragraph",children:[{type:"text",value:(match.input.slice(calloutDirective.length).trim()||capitalize(calloutType))+" "},...restChildren]},title=mdastToHtml(titleNode),toggleIcon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fold">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>`,blockquoteContent=[{type:"html",value:`<div
                  class="callout-title"
                >
                  <div class="callout-icon">${callouts[calloutType]}</div>
                  <div class="callout-title-inner">${title}</div>
                  ${collapse?toggleIcon:""}
                </div>`}];remainingText.length>0&&blockquoteContent.push({type:"paragraph",children:[{type:"text",value:remainingText}]}),node.children.splice(0,1,...blockquoteContent),node.data={hProperties:{...node.data?.hProperties??{},className:`callout ${collapse?"is-collapsible":""} ${defaultState==="collapsed"?"is-collapsed":""}`,"data-callout":calloutType,"data-callout-fold":collapse}}}})}),opts.mermaid&&plugins.push(()=>(tree,_file)=>{visit2(tree,"code",node=>{node.lang==="mermaid"&&(node.data={hProperties:{className:["mermaid"]}})})}),opts.parseTags&&plugins.push(()=>(tree,file)=>{let base=pathToRoot(file.data.slug);findAndReplace(tree,tagRegex,(_value,tag)=>(tag=slugTag(tag),file.data.frontmatter&&!file.data.frontmatter.tags.includes(tag)&&file.data.frontmatter.tags.push(tag),{type:"link",url:base+`/tags/${tag}`,data:{hProperties:{className:["tag-link"]}},children:[{type:"text",value:`#${tag}`}]}))}),plugins},htmlPlugins(){return[rehypeRaw]},externalResources(){let js=[];return opts.callouts&&js.push({script:callout_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.mermaid&&js.push({script:`
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';
          const darkMode = document.documentElement.getAttribute('saved-theme') === 'dark'
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: darkMode ? 'dark' : 'default'
          });
          document.addEventListener('nav', async () => {
            await mermaid.run({
              querySelector: '.mermaid'
            })
          });
          `,loadTime:"afterDOMReady",moduleType:"module",contentType:"inline"}),{js}}}},"ObsidianFlavoredMarkdown");var relrefRegex=new RegExp(/\[([^\]]+)\]\(\{\{< relref "([^"]+)" >\}\}\)/,"g"),predefinedHeadingIdRegex=new RegExp(/(.*) {#(?:.*)}/,"g"),hugoShortcodeRegex=new RegExp(/{{(.*)}}/,"g"),figureTagRegex=new RegExp(/< ?figure src="(.*)" ?>/,"g");import rehypePrettyCode from"rehype-pretty-code";var SyntaxHighlighting=__name(()=>({name:"SyntaxHighlighting",htmlPlugins(){return[[rehypePrettyCode,{theme:"css-variables"}]]}}),"SyntaxHighlighting");import{visit as visit3}from"unist-util-visit";import{toString as toString2}from"mdast-util-to-string";import Slugger from"github-slugger";var defaultOptions7={maxDepth:3,minEntries:1,showByDefault:!0},TableOfContents=__name(userOpts=>{let opts={...defaultOptions7,...userOpts};return{name:"TableOfContents",markdownPlugins(){return[()=>async(tree,file)=>{if(file.data.frontmatter?.enableToc??opts.showByDefault){let slugAnchor3=new Slugger,toc=[],highestDepth=opts.maxDepth;visit3(tree,"heading",node=>{if(node.depth<=opts.maxDepth){let text=toString2(node);highestDepth=Math.min(highestDepth,node.depth),toc.push({depth:node.depth,text,slug:slugAnchor3.slug(text)})}}),toc.length>opts.minEntries&&(file.data.toc=toc.map(entry=>({...entry,depth:entry.depth-highestDepth})))}}]}}},"TableOfContents");var RemoveDrafts=__name(()=>({name:"RemoveDrafts",shouldPublish(_ctx,[_tree,vfile]){return!(vfile.data?.frontmatter?.draft??!1)}}),"RemoveDrafts");import{jsx}from"preact/jsx-runtime";function Header({children}){return children.length>0?jsx("header",{children}):null}__name(Header,"Header");Header.css=`
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`;var Header_default=__name(()=>Header,"default");var clipboard_inline_default=`// quartz/components/scripts/quartz/components/scripts/clipboard.inline.ts
var svgCopy = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>';
var svgCheck = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';
document.addEventListener("nav", () => {
  const els = document.getElementsByTagName("pre");
  for (let i = 0; i < els.length; i++) {
    const codeBlock = els[i].getElementsByTagName("code")[0];
    if (codeBlock) {
      const source = codeBlock.innerText.replace(/\\n\\n/g, "\\n");
      const button = document.createElement("button");
      button.className = "clipboard-button";
      button.type = "button";
      button.innerHTML = svgCopy;
      button.ariaLabel = "Copy source";
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(source).then(
          () => {
            button.blur();
            button.innerHTML = svgCheck;
            setTimeout(() => {
              button.innerHTML = svgCopy;
              button.style.borderColor = "";
            }, 2e3);
          },
          (error) => console.error(error)
        );
      });
      els[i].prepend(button);
    }
  }
});
`;var clipboard_default=`
.clipboard-button {
  position: absolute;
  display: flex;
  float: right;
  right: 0;
  padding: 0.4rem;
  margin: -0.2rem 0.3rem;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.clipboard-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.clipboard-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.clipboard-button:focus {
  outline: 0;
}

pre:hover > .clipboard-button {
  opacity: 1;
  transition: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsiY2xpcGJvYXJkLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7OztBQUtGO0VBQ0U7RUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi5jbGlwYm9hcmQtYnV0dG9uIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbG9hdDogcmlnaHQ7XG4gIHJpZ2h0OiAwO1xuICBwYWRkaW5nOiAwLjRyZW07XG4gIG1hcmdpbjogLTAuMnJlbSAwLjNyZW07XG4gIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBib3JkZXI6IDFweCBzb2xpZDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiAwLjJzO1xuXG4gICYgPiBzdmcge1xuICAgIGZpbGw6IHZhcigtLWxpZ2h0KTtcbiAgICBmaWx0ZXI6IGNvbnRyYXN0KDAuMyk7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICB9XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxufVxuXG5wcmUge1xuICAmOmhvdmVyID4gLmNsaXBib2FyZC1idXR0b24ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNpdGlvbjogMC4ycztcbiAgfVxufVxuIl19 */`;import{jsx as jsx2}from"preact/jsx-runtime";function Body({children}){return jsx2("div",{id:"quartz-body",children})}__name(Body,"Body");Body.afterDOMLoaded=clipboard_inline_default;Body.css=clipboard_default;var Body_default=__name(()=>Body,"default");import{render}from"preact-render-to-string";import{randomUUID}from"crypto";import{jsx as jsx3}from"preact/jsx-runtime";function JSResourceToScriptElement(resource,preserve){let scriptType=resource.moduleType??"application/javascript",spaPreserve=preserve??resource.spaPreserve;if(resource.contentType==="external")return jsx3("script",{src:resource.src,type:scriptType,"spa-preserve":spaPreserve},resource.src);{let content=resource.script;return jsx3("script",{type:scriptType,"spa-preserve":spaPreserve,children:content},randomUUID())}}__name(JSResourceToScriptElement,"JSResourceToScriptElement");import{jsx as jsx4,jsxs}from"preact/jsx-runtime";function pageResources(slug2,staticResources){let baseDir=pathToRoot(slug2),contentIndexScript=`const fetchData = fetch(\`${joinSegments(baseDir,"static/contentIndex.json")}\`).then(data => data.json())`;return{css:[joinSegments(baseDir,"index.css"),...staticResources.css],js:[{src:joinSegments(baseDir,"prescript.js"),loadTime:"beforeDOMReady",contentType:"external"},{loadTime:"beforeDOMReady",contentType:"inline",spaPreserve:!0,script:contentIndexScript},...staticResources.js,{src:joinSegments(baseDir,"postscript.js"),loadTime:"afterDOMReady",moduleType:"module",contentType:"external"}]}}__name(pageResources,"pageResources");function renderPage(slug2,componentData,components,pageResources2){let{head:Head,header,beforeBody,pageBody:Content2,left,right,footer:Footer}=components,Header2=Header_default(),Body2=Body_default(),LeftComponent=jsx4("div",{class:"left sidebar",children:left.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),RightComponent=jsx4("div",{class:"right sidebar",children:right.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),doc=jsxs("html",{children:[jsx4(Head,{...componentData}),jsx4("body",{"data-slug":slug2,children:jsxs("div",{id:"quartz-root",class:"page",children:[jsxs(Body2,{...componentData,children:[LeftComponent,jsxs("div",{class:"center",children:[jsxs("div",{class:"page-header",children:[jsx4(Header2,{...componentData,children:header.map(HeaderComponent=>jsx4(HeaderComponent,{...componentData}))}),jsx4("div",{class:"popover-hint",children:beforeBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),jsx4(Content2,{...componentData})]}),RightComponent]}),jsx4(Footer,{...componentData})]})}),pageResources2.js.filter(resource=>resource.loadTime==="afterDOMReady").map(res=>JSResourceToScriptElement(res))]});return`<!DOCTYPE html>
`+render(doc)}__name(renderPage,"renderPage");import{Fragment,jsx as jsx5,jsxs as jsxs2}from"preact/jsx-runtime";import{toJsxRuntime}from"hast-util-to-jsx-runtime";import{jsx as jsx6}from"preact/jsx-runtime";function Content({tree}){let content=toJsxRuntime(tree,{Fragment,jsx:jsx5,jsxs:jsxs2,elementAttributeNameCase:"html"});return jsx6("article",{class:"popover-hint",children:content})}__name(Content,"Content");var Content_default=__name(()=>Content,"default");import{Fragment as Fragment3,jsx as jsx9,jsxs as jsxs4}from"preact/jsx-runtime";import{toJsxRuntime as toJsxRuntime2}from"hast-util-to-jsx-runtime";var listPage_default=`
ul.section-ul {
  list-style: none;
  margin-top: 2em;
  padding-left: 0;
}

li.section-li {
  margin-bottom: 1em;
}
li.section-li > .section {
  display: grid;
  grid-template-columns: 6em 3fr 1fr;
}
@media all and (max-width: 600px) {
  li.section-li > .section > .tags {
    display: none;
  }
}
li.section-li > .section > .tags {
  justify-self: end;
  margin-left: 1rem;
}
li.section-li > .section > .desc > h3 > a {
  background-color: transparent;
}
li.section-li > .section > .meta {
  margin: 0;
  flex-basis: 6em;
  opacity: 0.6;
}

.popover .section {
  grid-template-columns: 6em 1fr !important;
}
.popover .section > .tags {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsibGlzdFBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtJQUNFOzs7QUFJSjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBTU47RUFDRTs7QUFDQTtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5cbnVsLnNlY3Rpb24tdWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBtYXJnaW4tdG9wOiAyZW07XG4gIHBhZGRpbmctbGVmdDogMDtcbn1cblxubGkuc2VjdGlvbi1saSB7XG4gIG1hcmdpbi1ib3R0b206IDFlbTtcblxuICAmID4gLnNlY3Rpb24ge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA2ZW0gM2ZyIDFmcjtcblxuICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRtb2JpbGVCcmVha3BvaW50KSB7XG4gICAgICAmID4gLnRhZ3Mge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgPiAudGFncyB7XG4gICAgICBqdXN0aWZ5LXNlbGY6IGVuZDtcbiAgICAgIG1hcmdpbi1sZWZ0OiAxcmVtO1xuICAgIH1cblxuICAgICYgPiAuZGVzYyA+IGgzID4gYSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICB9XG5cbiAgICAmID4gLm1ldGEge1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgZmxleC1iYXNpczogNmVtO1xuICAgICAgb3BhY2l0eTogMC42O1xuICAgIH1cbiAgfVxufVxuXG4vLyBtb2RpZmljYXRpb25zIGluIHBvcG92ZXIgY29udGV4dFxuLnBvcG92ZXIgLnNlY3Rpb24ge1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDZlbSAxZnIgIWltcG9ydGFudDtcbiAgJiA+IC50YWdzIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4iXX0= */`;import{Fragment as Fragment2,jsx as jsx7}from"preact/jsx-runtime";function getDate(cfg,data){if(!cfg.defaultDateType)throw new Error("Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.");return data.dates?.[cfg.defaultDateType]}__name(getDate,"getDate");function formatDate(d){return d.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"2-digit"})}__name(formatDate,"formatDate");function Date2({date}){return jsx7(Fragment2,{children:formatDate(date)})}__name(Date2,"Date");import{jsx as jsx8,jsxs as jsxs3}from"preact/jsx-runtime";function byDateAndAlphabetical(cfg){return(f1,f2)=>{if(f1.dates&&f2.dates)return getDate(cfg,f2).getTime()-getDate(cfg,f1).getTime();if(f1.dates&&!f2.dates)return-1;if(!f1.dates&&f2.dates)return 1;let f1Title=f1.frontmatter?.title.toLowerCase()??"",f2Title=f2.frontmatter?.title.toLowerCase()??"";return f1Title.localeCompare(f2Title)}}__name(byDateAndAlphabetical,"byDateAndAlphabetical");function PageList({cfg,fileData,allFiles,limit}){let list=allFiles.sort(byDateAndAlphabetical(cfg));return limit&&(list=list.slice(0,limit)),jsx8("ul",{class:"section-ul",children:list.map(page=>{let title=page.frontmatter?.title,tags=page.frontmatter?.tags??[];return jsx8("li",{class:"section-li",children:jsxs3("div",{class:"section",children:[page.dates&&jsx8("p",{class:"meta",children:jsx8(Date2,{date:getDate(cfg,page)})}),jsx8("div",{class:"desc",children:jsx8("h3",{children:jsx8("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),jsx8("ul",{class:"tags",children:tags.map(tag=>jsx8("li",{children:jsxs3("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:["#",tag]})}))})]})})})})}__name(PageList,"PageList");PageList.css=`
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;function pluralize(count,s){return count===1?`1 ${s}`:`${count} ${s}s`}__name(pluralize,"pluralize");import{jsx as jsx10,jsxs as jsxs5}from"preact/jsx-runtime";var numPages=10;function TagContent(props){let{tree,fileData,allFiles}=props,slug2=fileData.slug;if(!(slug2?.startsWith("tags/")||slug2==="tags"))throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug2}`);let tag=simplifySlug(slug2.slice(5)),allPagesWithTag=__name(tag2=>allFiles.filter(file=>(file.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).includes(tag2)),"allPagesWithTag"),content=tree.children.length===0?fileData.description:toJsxRuntime2(tree,{Fragment:Fragment3,jsx:jsx9,jsxs:jsxs4,elementAttributeNameCase:"html"});if(tag===""){let tags=[...new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]))],tagItemMap=new Map;for(let tag2 of tags)tagItemMap.set(tag2,allPagesWithTag(tag2));return jsxs5("div",{class:"popover-hint",children:[jsx10("article",{children:jsx10("p",{children:content})}),jsxs5("p",{children:["Found ",tags.length," total tags."]}),jsx10("div",{children:tags.map(tag2=>{let pages=tagItemMap.get(tag2),listProps={...props,allFiles:pages},content2=allFiles.filter(file=>file.slug===`tags/${tag2}`)[0]?.description;return jsxs5("div",{children:[jsx10("h2",{children:jsxs5("a",{class:"internal tag-link",href:`./${tag2}`,children:["#",tag2]})}),content2&&jsx10("p",{children:content2}),jsxs5("p",{children:[pluralize(pages.length,"item")," with this tag."," ",pages.length>numPages&&`Showing first ${numPages}.`]}),jsx10(PageList,{limit:numPages,...listProps})]})})})]})}else{let pages=allPagesWithTag(tag),listProps={...props,allFiles:pages};return jsxs5("div",{class:"popover-hint",children:[jsx10("article",{children:content}),jsxs5("p",{children:[pluralize(pages.length,"item")," with this tag."]}),jsx10("div",{children:jsx10(PageList,{...listProps})})]})}}__name(TagContent,"TagContent");TagContent.css=listPage_default+PageList.css;var TagContent_default=__name(()=>TagContent,"default");import{Fragment as Fragment4,jsx as jsx11,jsxs as jsxs6}from"preact/jsx-runtime";import{toJsxRuntime as toJsxRuntime3}from"hast-util-to-jsx-runtime";import path5 from"path";import{jsx as jsx12,jsxs as jsxs7}from"preact/jsx-runtime";function FolderContent(props){let{tree,fileData,allFiles}=props,folderSlug=_stripSlashes(simplifySlug(fileData.slug)),allPagesInFolder=allFiles.filter(file=>{let fileSlug=_stripSlashes(simplifySlug(file.slug)),prefixed=fileSlug.startsWith(folderSlug)&&fileSlug!==folderSlug,folderParts=folderSlug.split(path5.posix.sep),isDirectChild=fileSlug.split(path5.posix.sep).length===folderParts.length+1;return prefixed&&isDirectChild}),listProps={...props,allFiles:allPagesInFolder},content=tree.children.length===0?fileData.description:toJsxRuntime3(tree,{Fragment:Fragment4,jsx:jsx11,jsxs:jsxs6,elementAttributeNameCase:"html"});return jsxs7("div",{class:"popover-hint",children:[jsx12("article",{children:jsx12("p",{children:content})}),jsxs7("p",{children:[pluralize(allPagesInFolder.length,"item")," under this folder."]}),jsx12("div",{children:jsx12(PageList,{...listProps})})]})}__name(FolderContent,"FolderContent");FolderContent.css=listPage_default+PageList.css;var FolderContent_default=__name(()=>FolderContent,"default");import{jsx as jsx13,jsxs as jsxs8}from"preact/jsx-runtime";function NotFound(){return jsxs8("article",{class:"popover-hint",children:[jsx13("h1",{children:"404"}),jsx13("p",{children:"Either this page is private or doesn't exist."})]})}__name(NotFound,"NotFound");var __default=__name(()=>NotFound,"default");import{jsx as jsx14}from"preact/jsx-runtime";function ArticleTitle({fileData}){let title=fileData.frontmatter?.title;return title?jsx14("h1",{class:"article-title",children:title}):null}__name(ArticleTitle,"ArticleTitle");ArticleTitle.css=`
.article-title {
  margin: 2rem 0 0 0;
}
`;var ArticleTitle_default=__name(()=>ArticleTitle,"default");var darkmode_inline_default=`// quartz/components/scripts/quartz/components/scripts/darkmode.inline.ts
var userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
var currentTheme = localStorage.getItem("theme") ?? userPref;
document.documentElement.setAttribute("saved-theme", currentTheme);
document.addEventListener("nav", () => {
  const switchTheme = (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute("saved-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("saved-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };
  const toggleSwitch = document.querySelector("#darkmode-toggle");
  toggleSwitch.removeEventListener("change", switchTheme);
  toggleSwitch.addEventListener("change", switchTheme);
  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
});
`;var darkmode_default=`
.darkmode {
  position: relative;
  width: 20px;
  height: 20px;
  margin: 0 10px;
}
.darkmode > .toggle {
  display: none;
  box-sizing: border-box;
}
.darkmode svg {
  cursor: pointer;
  opacity: 0;
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[saved-theme=dark] .toggle ~ label > #dayIcon {
  opacity: 0;
}
:root[saved-theme=dark] .toggle ~ label > #nightIcon {
  opacity: 1;
}

:root .toggle ~ label > #dayIcon {
  opacity: 1;
}
:root .toggle ~ label > #nightIcon {
  opacity: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsiZGFya21vZGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUtGO0VBQ0U7O0FBRUY7RUFDRTs7O0FBS0Y7RUFDRTs7QUFFRjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiLmRhcmttb2RlIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBtYXJnaW46IDAgMTBweDtcblxuICAmID4gLnRvZ2dsZSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB9XG5cbiAgJiBzdmcge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogMjBweDtcbiAgICBoZWlnaHQ6IDIwcHg7XG4gICAgdG9wOiBjYWxjKDUwJSAtIDEwcHgpO1xuICAgIGZpbGw6IHZhcigtLWRhcmtncmF5KTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMXMgZWFzZTtcbiAgfVxufVxuXG46cm9vdFtzYXZlZC10aGVtZT1cImRhcmtcIl0gLnRvZ2dsZSB+IGxhYmVsIHtcbiAgJiA+ICNkYXlJY29uIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG4gICYgPiAjbmlnaHRJY29uIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG59XG5cbjpyb290IC50b2dnbGUgfiBsYWJlbCB7XG4gICYgPiAjZGF5SWNvbiB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICAmID4gI25pZ2h0SWNvbiB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuIl19 */`;import{jsx as jsx15,jsxs as jsxs9}from"preact/jsx-runtime";function Darkmode(){return jsxs9("div",{class:"darkmode",children:[jsx15("input",{class:"toggle",id:"darkmode-toggle",type:"checkbox",tabIndex:-1}),jsx15("label",{id:"toggle-label-light",for:"darkmode-toggle",tabIndex:-1,children:jsxs9("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",id:"dayIcon",x:"0px",y:"0px",viewBox:"0 0 35 35",style:"enable-background:new 0 0 35 35;",xmlSpace:"preserve",children:[jsx15("title",{children:"Light mode"}),jsx15("path",{d:"M6,17.5C6,16.672,5.328,16,4.5,16h-3C0.672,16,0,16.672,0,17.5    S0.672,19,1.5,19h3C5.328,19,6,18.328,6,17.5z M7.5,26c-0.414,0-0.789,0.168-1.061,0.439l-2,2C4.168,28.711,4,29.086,4,29.5    C4,30.328,4.671,31,5.5,31c0.414,0,0.789-0.168,1.06-0.44l2-2C8.832,28.289,9,27.914,9,27.5C9,26.672,8.329,26,7.5,26z M17.5,6    C18.329,6,19,5.328,19,4.5v-3C19,0.672,18.329,0,17.5,0S16,0.672,16,1.5v3C16,5.328,16.671,6,17.5,6z M27.5,9    c0.414,0,0.789-0.168,1.06-0.439l2-2C30.832,6.289,31,5.914,31,5.5C31,4.672,30.329,4,29.5,4c-0.414,0-0.789,0.168-1.061,0.44    l-2,2C26.168,6.711,26,7.086,26,7.5C26,8.328,26.671,9,27.5,9z M6.439,8.561C6.711,8.832,7.086,9,7.5,9C8.328,9,9,8.328,9,7.5    c0-0.414-0.168-0.789-0.439-1.061l-2-2C6.289,4.168,5.914,4,5.5,4C4.672,4,4,4.672,4,5.5c0,0.414,0.168,0.789,0.439,1.06    L6.439,8.561z M33.5,16h-3c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5h3c0.828,0,1.5-0.672,1.5-1.5S34.328,16,33.5,16z     M28.561,26.439C28.289,26.168,27.914,26,27.5,26c-0.828,0-1.5,0.672-1.5,1.5c0,0.414,0.168,0.789,0.439,1.06l2,2    C28.711,30.832,29.086,31,29.5,31c0.828,0,1.5-0.672,1.5-1.5c0-0.414-0.168-0.789-0.439-1.061L28.561,26.439z M17.5,29    c-0.829,0-1.5,0.672-1.5,1.5v3c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-3C19,29.672,18.329,29,17.5,29z M17.5,7    C11.71,7,7,11.71,7,17.5S11.71,28,17.5,28S28,23.29,28,17.5S23.29,7,17.5,7z M17.5,25c-4.136,0-7.5-3.364-7.5-7.5    c0-4.136,3.364-7.5,7.5-7.5c4.136,0,7.5,3.364,7.5,7.5C25,21.636,21.636,25,17.5,25z"})]})}),jsx15("label",{id:"toggle-label-dark",for:"darkmode-toggle",tabIndex:-1,children:jsxs9("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",id:"nightIcon",x:"0px",y:"0px",viewBox:"0 0 100 100",style:"enable-background='new 0 0 100 100'",xmlSpace:"preserve",children:[jsx15("title",{children:"Dark mode"}),jsx15("path",{d:"M96.76,66.458c-0.853-0.852-2.15-1.064-3.23-0.534c-6.063,2.991-12.858,4.571-19.655,4.571  C62.022,70.495,50.88,65.88,42.5,57.5C29.043,44.043,25.658,23.536,34.076,6.47c0.532-1.08,0.318-2.379-0.534-3.23  c-0.851-0.852-2.15-1.064-3.23-0.534c-4.918,2.427-9.375,5.619-13.246,9.491c-9.447,9.447-14.65,22.008-14.65,35.369  c0,13.36,5.203,25.921,14.65,35.368s22.008,14.65,35.368,14.65c13.361,0,25.921-5.203,35.369-14.65  c3.872-3.871,7.064-8.328,9.491-13.246C97.826,68.608,97.611,67.309,96.76,66.458z"})]})})]})}__name(Darkmode,"Darkmode");Darkmode.beforeDOMLoaded=darkmode_inline_default;Darkmode.css=darkmode_default;var Darkmode_default=__name(()=>Darkmode,"default");import{jsx as jsx16,jsxs as jsxs10}from"preact/jsx-runtime";var Head_default=__name(()=>{function Head({cfg,fileData,externalResources}){let title=fileData.frontmatter?.title??"Untitled",description=fileData.description?.trim()??"No description provided",{css,js}=externalResources,baseDir=pathToRoot(fileData.slug),iconPath=joinSegments(baseDir,"static/icon.png"),ogImagePath=`https://${cfg.baseUrl}/static/og-image.png`;return jsxs10("head",{children:[jsx16("title",{children:title}),jsx16("meta",{charSet:"utf-8"}),jsx16("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),jsx16("meta",{property:"og:title",content:title}),jsx16("meta",{property:"og:description",content:description}),cfg.baseUrl&&jsx16("meta",{property:"og:image",content:ogImagePath}),jsx16("meta",{property:"og:width",content:"1200"}),jsx16("meta",{property:"og:height",content:"675"}),jsx16("link",{rel:"icon",href:iconPath}),jsx16("meta",{name:"description",content:description}),jsx16("meta",{name:"generator",content:"Quartz"}),jsx16("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),jsx16("link",{rel:"preconnect",href:"https://fonts.gstatic.com"}),css.map(href=>jsx16("link",{href,rel:"stylesheet",type:"text/css","spa-preserve":!0},href)),js.filter(resource=>resource.loadTime==="beforeDOMReady").map(res=>JSResourceToScriptElement(res,!0))]})}return __name(Head,"Head"),Head},"default");import{jsx as jsx17}from"preact/jsx-runtime";function PageTitle({fileData,cfg}){let title=cfg?.pageTitle??"Untitled Quartz",baseDir=pathToRoot(fileData.slug);return jsx17("h1",{class:"page-title",children:jsx17("a",{href:baseDir,children:title})})}__name(PageTitle,"PageTitle");PageTitle.css=`
.page-title {
  margin: 0;
}
`;var PageTitle_default=__name(()=>PageTitle,"default");import readingTime from"reading-time";import{jsx as jsx18}from"preact/jsx-runtime";var ContentMeta_default=__name(()=>{function ContentMetadata({cfg,fileData}){let text=fileData.text;if(text){let segments=[],{text:timeTaken,words:_words}=readingTime(text);return fileData.dates&&segments.push(formatDate(getDate(cfg,fileData))),segments.push(timeTaken),jsx18("p",{class:"content-meta",children:segments.join(", ")})}else return null}return __name(ContentMetadata,"ContentMetadata"),ContentMetadata.css=`
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `,ContentMetadata},"default");import{jsx as jsx19}from"preact/jsx-runtime";function Spacer({displayClass}){let className=displayClass?`spacer ${displayClass}`:"spacer";return jsx19("div",{class:className})}__name(Spacer,"Spacer");var Spacer_default=__name(()=>Spacer,"default");var legacyToc_default=`
details#toc summary {
  cursor: pointer;
}
details#toc summary::marker {
  color: var(--dark);
}
details#toc summary > * {
  padding-left: 0.25rem;
  display: inline-block;
  margin: 0;
}
details#toc ul {
  list-style: none;
  margin: 0.5rem 1.25rem;
  padding: 0;
}
details#toc .depth-1 {
  padding-left: calc(1rem * 1);
}
details#toc .depth-2 {
  padding-left: calc(1rem * 2);
}
details#toc .depth-3 {
  padding-left: calc(1rem * 3);
}
details#toc .depth-4 {
  padding-left: calc(1rem * 4);
}
details#toc .depth-5 {
  padding-left: calc(1rem * 5);
}
details#toc .depth-6 {
  padding-left: calc(1rem * 6);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsibGVnYWN5VG9jLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUlKO0VBQ0U7RUFDQTtFQUNBOztBQUlBO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiZGV0YWlscyN0b2Mge1xuICAmIHN1bW1hcnkge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICY6Om1hcmtlciB7XG4gICAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgfVxuXG4gICAgJiA+ICoge1xuICAgICAgcGFkZGluZy1sZWZ0OiAwLjI1cmVtO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cbiAgfVxuXG4gICYgdWwge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgbWFyZ2luOiAwLjVyZW0gMS4yNXJlbTtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgQGZvciAkaSBmcm9tIDEgdGhyb3VnaCA2IHtcbiAgICAmIC5kZXB0aC0jeyRpfSB7XG4gICAgICBwYWRkaW5nLWxlZnQ6IGNhbGMoMXJlbSAqICN7JGl9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;var toc_default=`
button#toc {
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}
button#toc h3 {
  font-size: 1rem;
  display: inline-block;
  margin: 0;
}
button#toc .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}
button#toc.collapsed .fold {
  transform: rotateZ(-90deg);
}

#toc-content {
  list-style: none;
  overflow: hidden;
  max-height: none;
  transition: max-height 0.5s ease;
}
#toc-content.collapsed > .overflow::after {
  opacity: 0;
}
#toc-content ul {
  list-style: none;
  margin: 0.5rem 0;
  padding: 0;
}
#toc-content ul > li > a {
  color: var(--dark);
  opacity: 0.35;
  transition: 0.5s ease opacity, 0.3s ease color;
}
#toc-content ul > li > a.in-view {
  opacity: 0.75;
}
#toc-content .depth-0 {
  padding-left: calc(1rem * 0);
}
#toc-content .depth-1 {
  padding-left: calc(1rem * 1);
}
#toc-content .depth-2 {
  padding-left: calc(1rem * 2);
}
#toc-content .depth-3 {
  padding-left: calc(1rem * 3);
}
#toc-content .depth-4 {
  padding-left: calc(1rem * 4);
}
#toc-content .depth-5 {
  padding-left: calc(1rem * 5);
}
#toc-content .depth-6 {
  padding-left: calc(1rem * 6);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsidG9jLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFDQTtFQUNFO0VBQ0E7RUFDQSxZQUNFOztBQUVGO0VBQ0U7O0FBTUo7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbImJ1dHRvbiN0b2Mge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiBub25lO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDA7XG4gIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAmIGgzIHtcbiAgICBmb250LXNpemU6IDFyZW07XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gICYgLmZvbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTtcbiAgICBvcGFjaXR5OiAwLjg7XG4gIH1cblxuICAmLmNvbGxhcHNlZCAuZm9sZCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVaKC05MGRlZyk7XG4gIH1cbn1cblxuI3RvYy1jb250ZW50IHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgbWF4LWhlaWdodDogbm9uZTtcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAwLjVzIGVhc2U7XG5cbiAgJi5jb2xsYXBzZWQgPiAub3ZlcmZsb3c6OmFmdGVyIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG5cbiAgJiB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDAuNXJlbSAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgJiA+IGxpID4gYSB7XG4gICAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgICBvcGFjaXR5OiAwLjM1O1xuICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgMC41cyBlYXNlIG9wYWNpdHksXG4gICAgICAgIDAuM3MgZWFzZSBjb2xvcjtcbiAgICAgICYuaW4tdmlldyB7XG4gICAgICAgIG9wYWNpdHk6IDAuNzU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQGZvciAkaSBmcm9tIDAgdGhyb3VnaCA2IHtcbiAgICAmIC5kZXB0aC0jeyRpfSB7XG4gICAgICBwYWRkaW5nLWxlZnQ6IGNhbGMoMXJlbSAqICN7JGl9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;var toc_inline_default=`// quartz/components/scripts/quartz/components/scripts/toc.inline.ts
var observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id;
    const tocEntryElement = document.querySelector(\`a[data-for="\${slug}"]\`);
    const windowHeight = entry.rootBounds?.height;
    if (windowHeight && tocEntryElement) {
      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElement.classList.add("in-view");
      } else {
        tocEntryElement.classList.remove("in-view");
      }
    }
  }
});
function toggleToc() {
  this.classList.toggle("collapsed");
  const content = this.nextElementSibling;
  content.classList.toggle("collapsed");
  content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px";
}
function setupToc() {
  const toc = document.getElementById("toc");
  if (toc) {
    const content = toc.nextElementSibling;
    content.style.maxHeight = content.scrollHeight + "px";
    toc.removeEventListener("click", toggleToc);
    toc.addEventListener("click", toggleToc);
  }
}
window.addEventListener("resize", setupToc);
document.addEventListener("nav", () => {
  setupToc();
  observer.disconnect();
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
  headers.forEach((header) => observer.observe(header));
});
`;import{jsx as jsx20,jsxs as jsxs11}from"preact/jsx-runtime";var defaultOptions8={layout:"modern"};function TableOfContents2({fileData,displayClass}){return fileData.toc?jsxs11("div",{class:`toc ${displayClass}`,children:[jsxs11("button",{type:"button",id:"toc",children:[jsx20("h3",{children:"Table of Contents"}),jsx20("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"fold",children:jsx20("polyline",{points:"6 9 12 15 18 9"})})]}),jsx20("div",{id:"toc-content",children:jsx20("ul",{class:"overflow",children:fileData.toc.map(tocEntry=>jsx20("li",{class:`depth-${tocEntry.depth}`,children:jsx20("a",{href:`#${tocEntry.slug}`,"data-for":tocEntry.slug,children:tocEntry.text})},tocEntry.slug))})})]}):null}__name(TableOfContents2,"TableOfContents");TableOfContents2.css=toc_default;TableOfContents2.afterDOMLoaded=toc_inline_default;function LegacyTableOfContents({fileData}){return fileData.toc?jsxs11("details",{id:"toc",open:!0,children:[jsx20("summary",{children:jsx20("h3",{children:"Table of Contents"})}),jsx20("ul",{children:fileData.toc.map(tocEntry=>jsx20("li",{class:`depth-${tocEntry.depth}`,children:jsx20("a",{href:`#${tocEntry.slug}`,"data-for":tocEntry.slug,children:tocEntry.text})},tocEntry.slug))})]}):null}__name(LegacyTableOfContents,"LegacyTableOfContents");LegacyTableOfContents.css=legacyToc_default;var TableOfContents_default=__name(opts=>(opts?.layout??defaultOptions8.layout)==="modern"?TableOfContents2:LegacyTableOfContents,"default");import{jsx as jsx21}from"preact/jsx-runtime";function TagList({fileData}){let tags=fileData.frontmatter?.tags,baseDir=pathToRoot(fileData.slug);return tags&&tags.length>0?jsx21("ul",{class:"tags",children:tags.map(tag=>{let display=`#${tag}`,linkDest=baseDir+`/tags/${slugTag(tag)}`;return jsx21("li",{children:jsx21("a",{href:linkDest,class:"internal tag-link",children:display})})})}):null}__name(TagList,"TagList");TagList.css=`
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;var TagList_default=__name(()=>TagList,"default");var graph_inline_default=`// node_modules/d3-dispatch/src/dispatch.js
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\\s.]/.test(t))
      throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n)
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name)))
          return t;
      return;
    }
    if (callback != null && typeof callback !== "function")
      throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type)
        _[t] = set(_[t], typename.name, callback);
      else if (callback == null)
        for (t in _)
          _[t] = set(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _)
      copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type2, that) {
    if ((n = arguments.length - 2) > 0)
      for (var args = new Array(n), i = 0, n, t; i < n; ++i)
        args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type2))
      throw new Error("unknown type: " + type2);
    for (t = this._[type2], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  },
  apply: function(type2, that, args) {
    if (!this._.hasOwnProperty(type2))
      throw new Error("unknown type: " + type2);
    for (var t = this._[type2], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  }
};
function get(type2, name) {
  for (var i = 0, n = type2.length, c2; i < n; ++i) {
    if ((c2 = type2[i]).name === name) {
      return c2.value;
    }
  }
}
function set(type2, name, callback) {
  for (var i = 0, n = type2.length; i < n; ++i) {
    if (type2[i].name === name) {
      type2[i] = noop, type2 = type2.slice(0, i).concat(type2.slice(i + 1));
      break;
    }
  }
  if (callback != null)
    type2.push({ name, value: callback });
  return type2;
}
var dispatch_default = dispatch;

// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
    name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array(x2) {
  return x2 == null ? [] : Array.isArray(x2) ? x2 : Array.from(x2);
}

// node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  if (typeof select === "function")
    select = arrayAll(select);
  else
    select = selectorAll_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default(x2) {
  return function() {
    return x2;
  };
}

// node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function")
    value = constant_default(value);
  for (var m2 = groups.length, update = new Array(m2), enter = new Array(m2), exit = new Array(m2), j = 0; j < m2; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1)
          i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength)
          ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter)
      enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update)
      update = update.selection();
  }
  if (onexit == null)
    exit.remove();
  else
    onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j = -1, m2 = groups.length; ++j < m2; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4)
          next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare)
    compare = ascending;
  function compareNode(a2, b) {
    return a2 && b ? compare(a2.__data__, b.__data__) : !a2 - !b;
  }
  for (var groups = this._groups, m2 = groups.length, sortgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a2, b) {
  return a2 < b ? -1 : a2 > b ? 1 : a2 >= b ? 0 : NaN;
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node)
        return node;
    }
  }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this)
    ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttribute(name);
    else
      this.setAttribute(name, v);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttributeNS(fullname.space, fullname.local);
    else
      this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.style.removeProperty(name);
    else
      this.style.setProperty(name, v, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      delete this[name];
    else
      this[name] = v;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n)
      if (!list.contains(names[i]))
        return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling)
    this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create2 = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent)
    parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames2(typenames) {
  return typenames.trim().split(/^|\\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on)
      return;
    for (var j = 0, i = -1, m2 = on.length, o; j < m2; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i)
      on.length = i;
    else
      delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on)
      for (var j = 0, m2 = on.length; j < m2; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on)
      this.__on = [o];
    else
      on.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on)
      for (var j = 0, m2 = on.length, o; j < m2; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
    return;
  }
  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i)
    this.each(on(typenames[i], value, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type2, params) {
  var window2 = window_default(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type2, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params)
      event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
    else
      event.initEvent(type2, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type2, params) {
  return function() {
    return dispatchEvent(this, type2, params);
  };
}
function dispatchFunction(type2, params) {
  return function() {
    return dispatchEvent(this, type2, params.apply(this, arguments));
  };
}
function dispatch_default2(type2, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        yield node;
    }
  }
}

// node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default2,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent)
    event = sourceEvent;
  return event;
}

// node_modules/d3-selection/src/pointer.js
function pointer_default(event, node) {
  event = sourceEvent_default(event);
  if (node === void 0)
    node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

// node_modules/d3-selection/src/selectAll.js
function selectAll_default2(selector) {
  return typeof selector === "string" ? new Selection([document.querySelectorAll(selector)], [document.documentElement]) : new Selection([array(selector)], root);
}

// node_modules/d3-drag/src/noevent.js
var nonpassive = { passive: false };
var nonpassivecapture = { capture: true, passive: false };
function nopropagation(event) {
  event.stopImmediatePropagation();
}
function noevent_default(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/d3-drag/src/nodrag.js
function nodrag_default(view) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
  } else {
    root2.__noselect = root2.style.MozUserSelect;
    root2.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent_default, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", null);
  } else {
    root2.style.MozUserSelect = root2.__noselect;
    delete root2.__noselect;
  }
}

// node_modules/d3-drag/src/constant.js
var constant_default2 = (x2) => () => x2;

// node_modules/d3-drag/src/event.js
function DragEvent(type2, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x: x2,
  y: y2,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type2, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x2, enumerable: true, configurable: true },
    y: { value: y2, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// node_modules/d3-drag/src/drag.js
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event, d) {
  return d == null ? { x: event.x, y: event.y } : d;
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag_default() {
  var filter2 = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners = dispatch_default("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag(selection2) {
    selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event, d) {
    if (touchending || !filter2.call(this, event, d))
      return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture)
      return;
    select_default2(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    nodrag_default(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }
  function mousemoved(event) {
    noevent_default(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }
  function mouseupped(event) {
    select_default2(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent_default(event);
    gestures.mouse("end", event);
  }
  function touchstarted(event, d) {
    if (!filter2.call(this, event, d))
      return;
    var touches = event.changedTouches, c2 = container.call(this, event, d), n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c2, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }
  function touchmoved(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent_default(event);
        gesture("drag", event, touches[i]);
      }
    }
  }
  function touchended(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    if (touchending)
      clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event, d, identifier, touch) {
    var dispatch2 = listeners.copy(), p = pointer_default(touch || event, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event,
      target: drag,
      identifier,
      active,
      x: p[0],
      y: p[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null)
      return;
    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;
    return function gesture(type2, event2, touch2) {
      var p0 = p, n;
      switch (type2) {
        case "start":
          gestures[identifier] = gesture, n = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        case "drag":
          p = pointer_default(touch2 || event2, container2), n = active;
          break;
      }
      dispatch2.call(
        type2,
        that,
        new DragEvent(type2, {
          sourceEvent: event2,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default2(!!_), drag) : filter2;
  };
  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant_default2(_), drag) : container;
  };
  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant_default2(_), drag) : subject;
  };
  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default2(!!_), drag) : touchable;
  };
  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };
  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };
  return drag;
}

// node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\\\s*([+-]?\\\\d+)\\\\s*";
var reN = "\\\\s*([+-]?(?:\\\\d*\\\\.)?\\\\d+(?:[eE][+-]?\\\\d+)?)\\\\s*";
var reP = "\\\\s*([+-]?(?:\\\\d*\\\\.)?\\\\d+(?:[eE][+-]?\\\\d+)?)%\\\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(\`^rgb\\\\(\${reI},\${reI},\${reI}\\\\)$\`);
var reRgbPercent = new RegExp(\`^rgb\\\\(\${reP},\${reP},\${reP}\\\\)$\`);
var reRgbaInteger = new RegExp(\`^rgba\\\\(\${reI},\${reI},\${reI},\${reN}\\\\)$\`);
var reRgbaPercent = new RegExp(\`^rgba\\\\(\${reP},\${reP},\${reP},\${reN}\\\\)$\`);
var reHslPercent = new RegExp(\`^hsl\\\\(\${reN},\${reP},\${reP}\\\\)$\`);
var reHslaPercent = new RegExp(\`^hsla\\\\(\${reN},\${reP},\${reP},\${reN}\\\\)$\`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m2, l;
  format = (format + "").trim().toLowerCase();
  return (m2 = reHex.exec(format)) ? (l = m2[1].length, m2 = parseInt(m2[1], 16), l === 6 ? rgbn(m2) : l === 3 ? new Rgb(m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, (m2 & 15) << 4 | m2 & 15, 1) : l === 8 ? rgba(m2 >> 24 & 255, m2 >> 16 & 255, m2 >> 8 & 255, (m2 & 255) / 255) : l === 4 ? rgba(m2 >> 12 & 15 | m2 >> 8 & 240, m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, ((m2 & 15) << 4 | m2 & 15) / 255) : null) : (m2 = reRgbInteger.exec(format)) ? new Rgb(m2[1], m2[2], m2[3], 1) : (m2 = reRgbPercent.exec(format)) ? new Rgb(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, 1) : (m2 = reRgbaInteger.exec(format)) ? rgba(m2[1], m2[2], m2[3], m2[4]) : (m2 = reRgbaPercent.exec(format)) ? rgba(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, m2[4]) : (m2 = reHslPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, 1) : (m2 = reHslaPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, m2[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a2) {
  if (a2 <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a2);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return \`#\${hex(this.r)}\${hex(this.g)}\${hex(this.b)}\`;
}
function rgb_formatHex8() {
  return \`#\${hex(this.r)}\${hex(this.g)}\${hex(this.b)}\${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}\`;
}
function rgb_formatRgb() {
  const a2 = clampa(this.opacity);
  return \`\${a2 === 1 ? "rgb(" : "rgba("}\${clampi(this.r)}, \${clampi(this.g)}, \${clampi(this.b)}\${a2 === 1 ? ")" : \`, \${a2})\`}\`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a2) {
  if (a2 <= 0)
    h = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s = NaN;
  else if (s <= 0)
    h = NaN;
  return new Hsl(h, s, l, a2);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max2 = Math.max(r, g, b), h = NaN, s = max2 - min2, l = (max2 + min2) / 2;
  if (s) {
    if (r === max2)
      h = (g - b) / s + (g < b) * 6;
    else if (g === max2)
      h = (b - r) / s + 2;
    else
      h = (r - g) / s + 4;
    s /= l < 0.5 ? max2 + min2 : 2 - max2 - min2;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a2 = clampa(this.opacity);
    return \`\${a2 === 1 ? "hsl(" : "hsla("}\${clamph(this.h)}, \${clampt(this.s) * 100}%, \${clampt(this.l) * 100}%\${a2 === 1 ? ")" : \`, \${a2})\`}\`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default3 = (x2) => () => x2;

// node_modules/d3-interpolate/src/color.js
function linear(a2, d) {
  return function(t) {
    return a2 + t * d;
  };
}
function exponential(a2, b, y2) {
  return a2 = Math.pow(a2, y2), b = Math.pow(b, y2) - a2, y2 = 1 / y2, function(t) {
    return Math.pow(a2 + t * b, y2);
  };
}
function gamma(y2) {
  return (y2 = +y2) === 1 ? nogamma : function(a2, b) {
    return b - a2 ? exponential(a2, b, y2) : constant_default3(isNaN(a2) ? b : a2);
  };
}
function nogamma(a2, b) {
  var d = b - a2;
  return d ? linear(a2, d) : constant_default3(isNaN(a2) ? b : a2);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y2) {
  var color2 = gamma(y2);
  function rgb2(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.r = r(t);
      start2.g = g(t);
      start2.b = b(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-interpolate/src/number.js
function number_default(a2, b) {
  return a2 = +a2, b = +b, function(t) {
    return a2 * (1 - t) + b * t;
  };
}

// node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\\d+\\.?\\d*|\\.?\\d+)(?:[eE][-+]?\\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a2, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a2 = a2 + "", b = b + "";
  while ((am = reA.exec(a2)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i])
        s[i] += bs;
      else
        s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i])
        s[i] += bm;
      else
        s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i])
      s[i] += bs;
    else
      s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a2, b, c2, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a2 * a2 + b * b))
    a2 /= scaleX, b /= scaleX;
  if (skewX = a2 * c2 + b * d)
    c2 -= a2 * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c2 * c2 + d * d))
    c2 /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a2 * d < b * c2)
    a2 = -a2, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a2) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}

// node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
  const m2 = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m2.isIdentity ? identity : decompose_default(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
}
function parseSvg(value) {
  if (value == null)
    return identity;
  if (!svgNode)
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate()))
    return identity;
  value = value.matrix;
  return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}

// node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a2, b, s, q) {
    if (a2 !== b) {
      if (a2 - b > 180)
        b += 360;
      else if (b - a2 > 180)
        a2 += 360;
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a2, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a2, b, s, q) {
    if (a2 !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a2, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a2, b) {
    var s = [], q = [];
    a2 = parse(a2), b = parse(b);
    translate(a2.translateX, a2.translateY, b.translateX, b.translateY, s, q);
    rotate(a2.rotate, b.rotate, s, q);
    skewX(a2.skewX, b.skewX, s, q);
    scale(a2.scaleX, a2.scaleY, b.scaleX, b.scaleY, s, q);
    a2 = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n)
        s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

// node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;
function cosh(x2) {
  return ((x2 = Math.exp(x2)) + 1 / x2) / 2;
}
function sinh(x2) {
  return ((x2 = Math.exp(x2)) - 1 / x2) / 2;
}
function tanh(x2) {
  return ((x2 = Math.exp(2 * x2)) - 1) / (x2 + 1);
}
var zoom_default = function zoomRho(rho, rho2, rho4) {
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom;
}(Math.SQRT2, 2, 4);

// node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function")
      throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail)
        taskTail._next = this;
      else
        taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0)
      t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay)
    clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time)
        time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame)
    return;
  if (timeout)
    timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity)
      timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval)
      interval = clearInterval(interval);
  } else {
    if (!interval)
      clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

// node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

// node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node, name, id2, index2, group, timing) {
  var schedules = node.__transition;
  if (!schedules)
    node.__transition = {};
  else if (id2 in schedules)
    return;
  create(node, id2, {
    name,
    index: index2,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > CREATED)
    throw new Error("too late; already scheduled");
  return schedule;
}
function set2(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > STARTED)
    throw new Error("too late; already running");
  return schedule;
}
function get2(node, id2) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id2]))
    throw new Error("transition not found");
  return schedule;
}
function create(node, id2, self) {
  var schedules = node.__transition, tween;
  schedules[id2] = self;
  self.timer = timer(schedule, 0, self.time);
  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start2, self.delay, self.time);
    if (self.delay <= elapsed)
      start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j, n, o;
    if (self.state !== SCHEDULED)
      return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name)
        continue;
      if (o.state === STARTED)
        return timeout_default(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout_default(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING)
      return;
    self.state = STARTED;
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t);
    }
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id2];
    for (var i in schedules)
      return;
    delete node.__transition;
  }
}

// node_modules/d3-transition/src/interrupt.js
function interrupt_default(node, name) {
  var schedules = node.__transition, schedule, active, empty2 = true, i;
  if (!schedules)
    return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty2 = false;
      continue;
    }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }
  if (empty2)
    delete node.__transition;
}

// node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function")
    throw new Error();
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n)
        tween1.push(t);
    }
    schedule.tween = tween1;
  };
}
function tween_default(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get2(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition2, name, value) {
  var id2 = transition2._id;
  transition2.each(function() {
    var schedule = set2(this, id2);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get2(node, id2).value[name];
  };
}

// node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a2, b) {
  var c2;
  return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c2 = color(b)) ? (b = c2, rgb_default) : string_default)(a2, b);
}

// node_modules/d3-transition/src/transition/attr.js
function attrRemove2(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null)
      return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attrFunctionNS2(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null)
      return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attr_default2(name, value) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
}

// node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween_default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  var fullname = namespace_default(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

// node_modules/d3-transition/src/transition/delay.js
function delayFunction(id2, value) {
  return function() {
    init(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init(this, id2).delay = value;
  };
}
function delay_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
}

// node_modules/d3-transition/src/transition/duration.js
function durationFunction(id2, value) {
  return function() {
    set2(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set2(this, id2).duration = value;
  };
}
function duration_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
}

// node_modules/d3-transition/src/transition/ease.js
function easeConstant(id2, value) {
  if (typeof value !== "function")
    throw new Error();
  return function() {
    set2(this, id2).ease = value;
  };
}
function ease_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
}

// node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id2, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function")
      throw new Error();
    set2(this, id2).ease = v;
  };
}
function easeVarying_default(value) {
  if (typeof value !== "function")
    throw new Error();
  return this.each(easeVarying(this._id, value));
}

// node_modules/d3-transition/src/transition/filter.js
function filter_default2(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition2) {
  if (transition2._id !== this._id)
    throw new Error();
  for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/on.js
function start(name) {
  return (name + "").trim().split(/^|\\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0)
      t = t.slice(0, i);
    return !t || t === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init : set2;
  return function() {
    var schedule = sit(this, id2), on = schedule.on;
    if (on !== on0)
      (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}
function on_default2(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}

// node_modules/d3-transition/src/transition/remove.js
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition)
      if (+i !== id2)
        return;
    if (parent)
      parent.removeChild(this);
  };
}
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/d3-transition/src/transition/select.js
function select_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}

// node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function")
    select = selectorAll_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
          if (child = children2[k]) {
            schedule_default(child, name, id2, k, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}

// node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function styleFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null)
      string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
    if (on !== on0 || listener0 !== listener)
      (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}
function style_default2(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
}

// node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}
function styleTween_default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

// node_modules/d3-transition/src/transition/text.js
function textConstant2(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction2(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function text_default2(value) {
  return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
}

// node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function textTween_default(value) {
  var key = "text";
  if (arguments.length < 1)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  return this.tween(key, textTween(value));
}

// node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get2(node, id0);
        schedule_default(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}

// node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0)
        resolve();
    } };
    that.each(function() {
      var schedule = set2(this, id2), on = schedule.on;
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule.on = on1;
    });
    if (size === 0)
      resolve();
  });
}

// node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function transition(name) {
  return selection_default().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default3,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default2,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

// node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(\`transition \${id2} not found\`);
    }
  }
  return timing;
}
function transition_default2(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}

// node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/d3-brush/src/brush.js
var { abs, max, min } = Math;
function number1(e) {
  return [+e[0], +e[1]];
}
function number2(e) {
  return [number1(e[0]), number1(e[1])];
}
var X = {
  name: "x",
  handles: ["w", "e"].map(type),
  input: function(x2, e) {
    return x2 == null ? null : [[+x2[0], e[0][1]], [+x2[1], e[1][1]]];
  },
  output: function(xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};
var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y2, e) {
    return y2 == null ? null : [[e[0][0], +y2[0]], [e[1][0], +y2[1]]];
  },
  output: function(xy) {
    return xy && [xy[0][1], xy[1][1]];
  }
};
var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
  input: function(xy) {
    return xy == null ? null : number2(xy);
  },
  output: function(xy) {
    return xy;
  }
};
function type(t) {
  return { type: t };
}

// node_modules/d3-force/src/center.js
function center_default(x2, y2) {
  var nodes, strength = 1;
  if (x2 == null)
    x2 = 0;
  if (y2 == null)
    y2 = 0;
  function force() {
    var i, n = nodes.length, node, sx = 0, sy = 0;
    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }
    for (sx = (sx / n - x2) * strength, sy = (sy / n - y2) * strength, i = 0; i < n; ++i) {
      node = nodes[i], node.x -= sx, node.y -= sy;
    }
  }
  force.initialize = function(_) {
    nodes = _;
  };
  force.x = function(_) {
    return arguments.length ? (x2 = +_, force) : x2;
  };
  force.y = function(_) {
    return arguments.length ? (y2 = +_, force) : y2;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  return force;
}

// node_modules/d3-quadtree/src/add.js
function add_default(d) {
  const x2 = +this._x.call(null, d), y2 = +this._y.call(null, d);
  return add(this.cover(x2, y2), x2, y2, d);
}
function add(tree, x2, y2, d) {
  if (isNaN(x2) || isNaN(y2))
    return tree;
  var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
  if (!node)
    return tree._root = leaf, tree;
  while (node.length) {
    if (right = x2 >= (xm = (x0 + x1) / 2))
      x0 = xm;
    else
      x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2))
      y0 = ym;
    else
      y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right]))
      return parent[i] = leaf, tree;
  }
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x2 === xp && y2 === yp)
    return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x2 >= (xm = (x0 + x1) / 2))
      x0 = xm;
    else
      x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2))
      y0 = ym;
    else
      y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
  var d, i, n = data.length, x2, y2, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (i = 0; i < n; ++i) {
    if (isNaN(x2 = +this._x.call(null, d = data[i])) || isNaN(y2 = +this._y.call(null, d)))
      continue;
    xz[i] = x2;
    yz[i] = y2;
    if (x2 < x0)
      x0 = x2;
    if (x2 > x1)
      x1 = x2;
    if (y2 < y0)
      y0 = y2;
    if (y2 > y1)
      y1 = y2;
  }
  if (x0 > x1 || y0 > y1)
    return this;
  this.cover(x0, y0).cover(x1, y1);
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }
  return this;
}

// node_modules/d3-quadtree/src/cover.js
function cover_default(x2, y2) {
  if (isNaN(x2 = +x2) || isNaN(y2 = +y2))
    return this;
  var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x2)) + 1;
    y1 = (y0 = Math.floor(y2)) + 1;
  } else {
    var z = x1 - x0 || 1, node = this._root, parent, i;
    while (x0 > x2 || x2 >= x1 || y0 > y2 || y2 >= y1) {
      i = (y2 < y0) << 1 | x2 < x0;
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0:
          x1 = x0 + z, y1 = y0 + z;
          break;
        case 1:
          x0 = x1 - z, y1 = y0 + z;
          break;
        case 2:
          x1 = x0 + z, y0 = y1 - z;
          break;
        case 3:
          x0 = x1 - z, y0 = y1 - z;
          break;
      }
    }
    if (this._root && this._root.length)
      this._root = node;
  }
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

// node_modules/d3-quadtree/src/data.js
function data_default2() {
  var data = [];
  this.visit(function(node) {
    if (!node.length)
      do
        data.push(node.data);
      while (node = node.next);
  });
  return data;
}

// node_modules/d3-quadtree/src/extent.js
function extent_default(_) {
  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}

// node_modules/d3-quadtree/src/quad.js
function quad_default(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

// node_modules/d3-quadtree/src/find.js
function find_default(x2, y2, radius) {
  var data, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x3 = this._x1, y3 = this._y1, quads = [], node = this._root, q, i;
  if (node)
    quads.push(new quad_default(node, x0, y0, x3, y3));
  if (radius == null)
    radius = Infinity;
  else {
    x0 = x2 - radius, y0 = y2 - radius;
    x3 = x2 + radius, y3 = y2 + radius;
    radius *= radius;
  }
  while (q = quads.pop()) {
    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x22 = q.x1) < x0 || (y22 = q.y1) < y0)
      continue;
    if (node.length) {
      var xm = (x1 + x22) / 2, ym = (y1 + y22) / 2;
      quads.push(
        new quad_default(node[3], xm, ym, x22, y22),
        new quad_default(node[2], x1, ym, xm, y22),
        new quad_default(node[1], xm, y1, x22, ym),
        new quad_default(node[0], x1, y1, xm, ym)
      );
      if (i = (y2 >= ym) << 1 | x2 >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
      var dx = x2 - +this._x.call(null, node.data), dy = y2 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x2 - d, y0 = y2 - d;
        x3 = x2 + d, y3 = y2 + d;
        data = node.data;
      }
    }
  }
  return data;
}

// node_modules/d3-quadtree/src/remove.js
function remove_default3(d) {
  if (isNaN(x2 = +this._x.call(null, d)) || isNaN(y2 = +this._y.call(null, d)))
    return this;
  var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x2, y2, xm, ym, right, bottom, i, j;
  if (!node)
    return this;
  if (node.length)
    while (true) {
      if (right = x2 >= (xm = (x0 + x1) / 2))
        x0 = xm;
      else
        x1 = xm;
      if (bottom = y2 >= (ym = (y0 + y1) / 2))
        y0 = ym;
      else
        y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right]))
        return this;
      if (!node.length)
        break;
      if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3])
        retainer = parent, j = i;
    }
  while (node.data !== d)
    if (!(previous = node, node = node.next))
      return this;
  if (next = node.next)
    delete node.next;
  if (previous)
    return next ? previous.next = next : delete previous.next, this;
  if (!parent)
    return this._root = next, this;
  next ? parent[i] = next : delete parent[i];
  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer)
      retainer[j] = node;
    else
      this._root = node;
  }
  return this;
}
function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i)
    this.remove(data[i]);
  return this;
}

// node_modules/d3-quadtree/src/root.js
function root_default() {
  return this._root;
}

// node_modules/d3-quadtree/src/size.js
function size_default2() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length)
      do
        ++size;
      while (node = node.next);
  });
  return size;
}

// node_modules/d3-quadtree/src/visit.js
function visit_default(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node)
    quads.push(new quad_default(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3])
        quads.push(new quad_default(child, xm, ym, x1, y1));
      if (child = node[2])
        quads.push(new quad_default(child, x0, ym, xm, y1));
      if (child = node[1])
        quads.push(new quad_default(child, xm, y0, x1, ym));
      if (child = node[0])
        quads.push(new quad_default(child, x0, y0, xm, ym));
    }
  }
  return this;
}

// node_modules/d3-quadtree/src/visitAfter.js
function visitAfter_default(callback) {
  var quads = [], next = [], q;
  if (this._root)
    quads.push(new quad_default(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0])
        quads.push(new quad_default(child, x0, y0, xm, ym));
      if (child = node[1])
        quads.push(new quad_default(child, xm, y0, x1, ym));
      if (child = node[2])
        quads.push(new quad_default(child, x0, ym, xm, y1));
      if (child = node[3])
        quads.push(new quad_default(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}

// node_modules/d3-quadtree/src/x.js
function defaultX(d) {
  return d[0];
}
function x_default(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

// node_modules/d3-quadtree/src/y.js
function defaultY(d) {
  return d[1];
}
function y_default(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

// node_modules/d3-quadtree/src/quadtree.js
function quadtree(nodes, x2, y2) {
  var tree = new Quadtree(x2 == null ? defaultX : x2, y2 == null ? defaultY : y2, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x2, y2, x0, y0, x1, y1) {
  this._x = x2;
  this._y = y2;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = void 0;
}
function leaf_copy(leaf) {
  var copy = { data: leaf.data }, next = copy;
  while (leaf = leaf.next)
    next = next.next = { data: leaf.data };
  return copy;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
  if (!node)
    return copy;
  if (!node.length)
    return copy._root = leaf_copy(node), copy;
  nodes = [{ source: node, target: copy._root = new Array(4) }];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length)
          nodes.push({ source: child, target: node.target[i] = new Array(4) });
        else
          node.target[i] = leaf_copy(child);
      }
    }
  }
  return copy;
};
treeProto.add = add_default;
treeProto.addAll = addAll;
treeProto.cover = cover_default;
treeProto.data = data_default2;
treeProto.extent = extent_default;
treeProto.find = find_default;
treeProto.remove = remove_default3;
treeProto.removeAll = removeAll;
treeProto.root = root_default;
treeProto.size = size_default2;
treeProto.visit = visit_default;
treeProto.visitAfter = visitAfter_default;
treeProto.x = x_default;
treeProto.y = y_default;

// node_modules/d3-force/src/constant.js
function constant_default5(x2) {
  return function() {
    return x2;
  };
}

// node_modules/d3-force/src/jiggle.js
function jiggle_default(random) {
  return (random() - 0.5) * 1e-6;
}

// node_modules/d3-force/src/link.js
function index(d) {
  return d.index;
}
function find2(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node)
    throw new Error("node not found: " + nodeId);
  return node;
}
function link_default(links) {
  var id2 = index, strength = defaultStrength, strengths, distance = constant_default5(30), distances, nodes, count, bias, random, iterations = 1;
  if (links == null)
    links = [];
  function defaultStrength(link) {
    return 1 / Math.min(count[link.source.index], count[link.target.index]);
  }
  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x2, y2, l, b; i < n; ++i) {
        link = links[i], source = link.source, target = link.target;
        x2 = target.x + target.vx - source.x - source.vx || jiggle_default(random);
        y2 = target.y + target.vy - source.y - source.vy || jiggle_default(random);
        l = Math.sqrt(x2 * x2 + y2 * y2);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x2 *= l, y2 *= l;
        target.vx -= x2 * (b = bias[i]);
        target.vy -= y2 * b;
        source.vx += x2 * (b = 1 - b);
        source.vy += y2 * b;
      }
    }
  }
  function initialize() {
    if (!nodes)
      return;
    var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2) => [id2(d, i2, nodes), d])), link;
    for (i = 0, count = new Array(n); i < m2; ++i) {
      link = links[i], link.index = i;
      if (typeof link.source !== "object")
        link.source = find2(nodeById, link.source);
      if (typeof link.target !== "object")
        link.target = find2(nodeById, link.target);
      count[link.source.index] = (count[link.source.index] || 0) + 1;
      count[link.target.index] = (count[link.target.index] || 0) + 1;
    }
    for (i = 0, bias = new Array(m2); i < m2; ++i) {
      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
    }
    strengths = new Array(m2), initializeStrength();
    distances = new Array(m2), initializeDistance();
  }
  function initializeStrength() {
    if (!nodes)
      return;
    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }
  function initializeDistance() {
    if (!nodes)
      return;
    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };
  force.id = function(_) {
    return arguments.length ? (id2 = _, force) : id2;
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initializeStrength(), force) : strength;
  };
  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant_default5(+_), initializeDistance(), force) : distance;
  };
  return force;
}

// node_modules/d3-force/src/lcg.js
var a = 1664525;
var c = 1013904223;
var m = 4294967296;
function lcg_default() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}

// node_modules/d3-force/src/simulation.js
function x(d) {
  return d.x;
}
function y(d) {
  return d.y;
}
var initialRadius = 10;
var initialAngle = Math.PI * (3 - Math.sqrt(5));
function simulation_default(nodes) {
  var simulation, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = /* @__PURE__ */ new Map(), stepper = timer(step), event = dispatch_default("tick", "end"), random = lcg_default();
  if (nodes == null)
    nodes = [];
  function step() {
    tick();
    event.call("tick", simulation);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation);
    }
  }
  function tick(iterations) {
    var i, n = nodes.length, node;
    if (iterations === void 0)
      iterations = 1;
    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.forEach(function(force) {
        force(alpha);
      });
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null)
          node.x += node.vx *= velocityDecay;
        else
          node.x = node.fx, node.vx = 0;
        if (node.fy == null)
          node.y += node.vy *= velocityDecay;
        else
          node.y = node.fy, node.vy = 0;
      }
    }
    return simulation;
  }
  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null)
        node.x = node.fx;
      if (node.fy != null)
        node.y = node.fy;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }
  function initializeForce(force) {
    if (force.initialize)
      force.initialize(nodes, random);
    return force;
  }
  initializeNodes();
  return simulation = {
    tick,
    restart: function() {
      return stepper.restart(step), simulation;
    },
    stop: function() {
      return stepper.stop(), simulation;
    },
    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
    },
    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },
    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },
    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },
    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },
    randomSource: function(_) {
      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
    },
    force: function(name, _) {
      return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
    },
    find: function(x2, y2, radius) {
      var i = 0, n = nodes.length, dx, dy, d2, node, closest;
      if (radius == null)
        radius = Infinity;
      else
        radius *= radius;
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x2 - node.x;
        dy = y2 - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius)
          closest = node, radius = d2;
      }
      return closest;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}

// node_modules/d3-force/src/manyBody.js
function manyBody_default() {
  var nodes, node, random, alpha, strength = constant_default5(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate);
    for (alpha = _, i = 0; i < n; ++i)
      node = nodes[i], tree.visit(apply);
  }
  function initialize() {
    if (!nodes)
      return;
    var i, n = nodes.length, node2;
    strengths = new Array(n);
    for (i = 0; i < n; ++i)
      node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
  }
  function accumulate(quad) {
    var strength2 = 0, q, c2, weight = 0, x2, y2, i;
    if (quad.length) {
      for (x2 = y2 = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
          strength2 += q.value, weight += c2, x2 += c2 * q.x, y2 += c2 * q.y;
        }
      }
      quad.x = x2 / weight;
      quad.y = y2 / weight;
    } else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do
        strength2 += strengths[q.data.index];
      while (q = q.next);
    }
    quad.value = strength2;
  }
  function apply(quad, x1, _, x2) {
    if (!quad.value)
      return true;
    var x3 = quad.x - node.x, y2 = quad.y - node.y, w = x2 - x1, l = x3 * x3 + y2 * y2;
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x3 === 0)
          x3 = jiggle_default(random), l += x3 * x3;
        if (y2 === 0)
          y2 = jiggle_default(random), l += y2 * y2;
        if (l < distanceMin2)
          l = Math.sqrt(distanceMin2 * l);
        node.vx += x3 * quad.value * alpha / l;
        node.vy += y2 * quad.value * alpha / l;
      }
      return true;
    } else if (quad.length || l >= distanceMax2)
      return;
    if (quad.data !== node || quad.next) {
      if (x3 === 0)
        x3 = jiggle_default(random), l += x3 * x3;
      if (y2 === 0)
        y2 = jiggle_default(random), l += y2 * y2;
      if (l < distanceMin2)
        l = Math.sqrt(distanceMin2 * l);
    }
    do
      if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x3 * w;
        node.vy += y2 * w;
      }
    while (quad = quad.next);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : strength;
  };
  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };
  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };
  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };
  return force;
}

// node_modules/d3-zoom/src/constant.js
var constant_default6 = (x2) => () => x2;

// node_modules/d3-zoom/src/event.js
function ZoomEvent(type2, {
  sourceEvent,
  target,
  transform: transform2,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type2, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform2, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}

// node_modules/d3-zoom/src/transform.js
function Transform(k, x2, y2) {
  this.k = k;
  this.x = x2;
  this.y = y2;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x2, y2) {
    return x2 === 0 & y2 === 0 ? this : new Transform(this.k, this.x + this.k * x2, this.y + this.k * y2);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x2) {
    return x2 * this.k + this.x;
  },
  applyY: function(y2) {
    return y2 * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x2) {
    return (x2 - this.x) / this.k;
  },
  invertY: function(y2) {
    return (y2 - this.y) / this.k;
  },
  rescaleX: function(x2) {
    return x2.copy().domain(x2.range().map(this.invertX, this).map(x2.invert, x2));
  },
  rescaleY: function(y2) {
    return y2.copy().domain(y2.range().map(this.invertY, this).map(y2.invert, y2));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
  while (!node.__zoom)
    if (!(node = node.parentNode))
      return identity2;
  return node.__zoom;
}

// node_modules/d3-zoom/src/noevent.js
function nopropagation3(event) {
  event.stopImmediatePropagation();
}
function noevent_default3(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/d3-zoom/src/zoom.js
function defaultFilter2(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity2;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable2() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform2, extent, translateExtent) {
  var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
  return transform2.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom_default2() {
  var filter2 = defaultFilter2, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable2, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom.transform = function(collection, transform2, point, event) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule(collection, transform2, point, event);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
      });
    }
  };
  zoom.scaleBy = function(selection2, k, p, event) {
    zoom.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };
  zoom.scaleTo = function(selection2, k, p, event) {
    zoom.transform(selection2, function() {
      var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };
  zoom.translateBy = function(selection2, x2, y2, event) {
    zoom.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x2 === "function" ? x2.apply(this, arguments) : x2,
        typeof y2 === "function" ? y2.apply(this, arguments) : y2
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom.translateTo = function(selection2, x2, y2, p, event) {
    zoom.transform(selection2, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x2 === "function" ? -x2.apply(this, arguments) : -x2,
        typeof y2 === "function" ? -y2.apply(this, arguments) : -y2
      ), e, translateExtent);
    }, p, event);
  };
  function scale(transform2, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x2 = p0[0] - p1[0] * transform2.k, y2 = p0[1] - p1[1] * transform2.k;
    return x2 === transform2.x && y2 === transform2.y ? transform2 : new Transform(transform2.k, x2, y2);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule(transition2, transform2, point, event) {
    transition2.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a2 = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a2.invert(p).concat(w / a2.k), b.invert(p).concat(w / b.k));
      return function(t) {
        if (t === 1)
          t = b;
        else {
          var l = i(t), k = w / l[2];
          t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
        }
        g.zoom(null, t);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event)
        this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform2) {
      if (this.mouse && key !== "mouse")
        this.mouse[1] = transform2.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch")
        this.touch0[1] = transform2.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch")
        this.touch1[1] = transform2.invert(this.touch1[0]);
      this.that.__zoom = transform2;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type2) {
      var d = select_default2(this.that).datum();
      listeners.call(
        type2,
        this.that,
        new ZoomEvent(type2, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type: type2,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter2.apply(this, arguments))
      return;
    var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer_default(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    } else if (t.k === k)
      return;
    else {
      g.mouse = [p, t.invert(p)];
      interrupt_default(this);
      g.start();
    }
    noevent_default3(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter2.apply(this, arguments))
      return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select_default2(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    nodrag_default(event.view);
    nopropagation3(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt_default(this);
    g.start();
    function mousemoved(event2) {
      noevent_default3(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent_default3(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter2.apply(this, arguments))
      return;
    var t0 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent_default3(event);
    if (duration > 0)
      select_default2(this).transition().duration(duration).call(schedule, t1, p0, event);
    else
      select_default2(this).call(zoom.transform, t1, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter2.apply(this, arguments))
      return;
    var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
    nopropagation3(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0)
        g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2])
        g.touch1 = p, g.taps = 0;
    }
    if (touchstarting)
      touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2)
        touchfirst = p[0], touchstarting = setTimeout(function() {
          touchstarting = null;
        }, touchDelay);
      interrupt_default(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming)
      return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
    noevent_default3(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier)
        g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier)
        g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0)
      p = g.touch0[0], l = g.touch0[1];
    else
      return;
    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming)
      return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
    nopropagation3(event);
    if (touchending)
      clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier)
        delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier)
        delete g.touch1;
    }
    if (g.touch1 && !g.touch0)
      g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0)
      g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t = pointer_default(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select_default2(this).on("dblclick.zoom");
          if (p)
            p.apply(this, arguments);
        }
      }
    }
  }
  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant_default6(+_), zoom) : wheelDelta;
  };
  zoom.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default6(!!_), zoom) : filter2;
  };
  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default6(!!_), zoom) : touchable;
  };
  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant_default6([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };
  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };
  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };
  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };
  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };
  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };
  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };
  return zoom;
}

// quartz/components/scripts/util.ts
function registerEscapeHandler(outsideContainer, cb) {
  if (!outsideContainer)
    return;
  function click(e) {
    if (e.target !== this)
      return;
    e.preventDefault();
    cb();
  }
  function esc(e) {
    if (!e.key.startsWith("Esc"))
      return;
    e.preventDefault();
    cb();
  }
  outsideContainer?.removeEventListener("click", click);
  outsideContainer?.addEventListener("click", click);
  document.removeEventListener("keydown", esc);
  document.addEventListener("keydown", esc);
}
function removeAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
function getFullSlug(window2) {
  const res = window2.document.body.dataset.slug;
  return res;
}
function simplifySlug(fp) {
  return _stripSlashes(_trimSuffix(fp, "index"), true);
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}
function joinSegments(...args) {
  return args.filter((segment) => segment !== "").join("/");
}
function _endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function _trimSuffix(s, suffix) {
  if (_endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function _stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}

// quartz/components/scripts/quartz/components/scripts/graph.inline.ts
var localStorageKey = "graph-visited";
function getVisited() {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"));
}
function addToVisited(slug2) {
  const visited = getVisited();
  visited.add(slug2);
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]));
}
async function renderGraph(container, fullSlug) {
  const slug2 = simplifySlug(fullSlug);
  const visited = getVisited();
  const graph = document.getElementById(container);
  if (!graph)
    return;
  removeAllChildren(graph);
  let {
    drag: enableDrag,
    zoom: enableZoom,
    depth,
    scale,
    repelForce,
    centerForce,
    linkDistance,
    fontSize,
    opacityScale
  } = JSON.parse(graph.dataset["cfg"]);
  const data = await fetchData;
  const links = [];
  const validLinks = new Set(Object.keys(data).map((slug3) => simplifySlug(slug3)));
  for (const [src, details] of Object.entries(data)) {
    const source = simplifySlug(src);
    const outgoing = details.links ?? [];
    for (const dest of outgoing) {
      if (validLinks.has(dest)) {
        links.push({ source, target: dest });
      }
    }
  }
  const neighbourhood = /* @__PURE__ */ new Set();
  const wl = [slug2, "__SENTINEL"];
  if (depth >= 0) {
    while (depth >= 0 && wl.length > 0) {
      const cur = wl.shift();
      if (cur === "__SENTINEL") {
        depth--;
        wl.push("__SENTINEL");
      } else {
        neighbourhood.add(cur);
        const outgoing = links.filter((l) => l.source === cur);
        const incoming = links.filter((l) => l.target === cur);
        wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source));
      }
    }
  } else {
    Object.keys(data).forEach((id2) => neighbourhood.add(simplifySlug(id2)));
  }
  const graphData = {
    nodes: [...neighbourhood].map((url) => ({
      id: url,
      text: data[url]?.title ?? url,
      tags: data[url]?.tags ?? []
    })),
    links: links.filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
  };
  const simulation = simulation_default(graphData.nodes).force("charge", manyBody_default().strength(-100 * repelForce)).force(
    "link",
    link_default(graphData.links).id((d) => d.id).distance(linkDistance)
  ).force("center", center_default().strength(centerForce));
  const height = Math.max(graph.offsetHeight, 250);
  const width = graph.offsetWidth;
  const svg = select_default2("#" + container).append("svg").attr("width", width).attr("height", height).attr("viewBox", [-width / 2 / scale, -height / 2 / scale, width / scale, height / scale]);
  const link = svg.append("g").selectAll("line").data(graphData.links).join("line").attr("class", "link").attr("stroke", "var(--lightgray)").attr("stroke-width", 1);
  const graphNode = svg.append("g").selectAll("g").data(graphData.nodes).enter().append("g");
  const color2 = (d) => {
    const isCurrent = d.id === slug2;
    if (isCurrent) {
      return "var(--secondary)";
    } else if (visited.has(d.id)) {
      return "var(--tertiary)";
    } else {
      return "var(--gray)";
    }
  };
  const drag = (simulation2) => {
    function dragstarted(event, d) {
      if (!event.active)
        simulation2.alphaTarget(1).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active)
        simulation2.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    const noop2 = () => {
    };
    return drag_default().on("start", enableDrag ? dragstarted : noop2).on("drag", enableDrag ? dragged : noop2).on("end", enableDrag ? dragended : noop2);
  };
  function nodeRadius(d) {
    const numLinks = links.filter((l) => l.source.id === d.id || l.target.id === d.id).length;
    return 2 + Math.sqrt(numLinks);
  }
  const node = graphNode.append("circle").attr("class", "node").attr("id", (d) => d.id).attr("r", nodeRadius).attr("fill", color2).style("cursor", "pointer").on("click", (_, d) => {
    const targ = resolveRelative(fullSlug, d.id);
    window.spaNavigate(new URL(targ, window.location.toString()));
  }).on("mouseover", function(_, d) {
    const neighbours = data[fullSlug].links ?? [];
    const neighbourNodes = selectAll_default2(".node").filter((d2) => neighbours.includes(d2.id));
    const currentId = d.id;
    const linkNodes = selectAll_default2(".link").filter((d2) => d2.source.id === currentId || d2.target.id === currentId);
    neighbourNodes.transition().duration(200).attr("fill", color2);
    linkNodes.transition().duration(200).attr("stroke", "var(--gray)").attr("stroke-width", 1);
    const bigFont = fontSize * 1.5;
    const parent = this.parentNode;
    select_default2(parent).raise().select("text").transition().duration(200).attr("opacityOld", select_default2(parent).select("text").style("opacity")).style("opacity", 1).style("font-size", bigFont + "em");
  }).on("mouseleave", function(_, d) {
    const currentId = d.id;
    const linkNodes = selectAll_default2(".link").filter((d2) => d2.source.id === currentId || d2.target.id === currentId);
    linkNodes.transition().duration(200).attr("stroke", "var(--lightgray)");
    const parent = this.parentNode;
    select_default2(parent).select("text").transition().duration(200).style("opacity", select_default2(parent).select("text").attr("opacityOld")).style("font-size", fontSize + "em");
  }).call(drag(simulation));
  const labels = graphNode.append("text").attr("dx", 0).attr("dy", (d) => -nodeRadius(d) + "px").attr("text-anchor", "middle").text(
    (d) => data[d.id]?.title || (d.id.charAt(0).toUpperCase() + d.id.slice(1, d.id.length - 1)).replace("-", " ")
  ).style("opacity", (opacityScale - 1) / 3.75).style("pointer-events", "none").style("font-size", fontSize + "em").raise().call(drag(simulation));
  if (enableZoom) {
    svg.call(
      zoom_default2().extent([
        [0, 0],
        [width, height]
      ]).scaleExtent([0.25, 4]).on("zoom", ({ transform: transform2 }) => {
        link.attr("transform", transform2);
        node.attr("transform", transform2);
        const scale2 = transform2.k * opacityScale;
        const scaledOpacity = Math.max((scale2 - 1) / 3.75, 0);
        labels.attr("transform", transform2).style("opacity", scaledOpacity);
      })
    );
  }
  simulation.on("tick", () => {
    link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });
}
function renderGlobalGraph() {
  const slug2 = getFullSlug(window);
  const container = document.getElementById("global-graph-outer");
  const sidebar = container?.closest(".sidebar");
  container?.classList.add("active");
  if (sidebar) {
    sidebar.style.zIndex = "1";
  }
  renderGraph("global-graph-container", slug2);
  function hideGlobalGraph() {
    container?.classList.remove("active");
    const graph = document.getElementById("global-graph-container");
    if (sidebar) {
      sidebar.style.zIndex = "unset";
    }
    if (!graph)
      return;
    removeAllChildren(graph);
  }
  registerEscapeHandler(container, hideGlobalGraph);
}
document.addEventListener("nav", async (e) => {
  const slug2 = e.detail.url;
  addToVisited(slug2);
  await renderGraph("graph-container", slug2);
  const containerIcon = document.getElementById("global-graph-icon");
  containerIcon?.removeEventListener("click", renderGlobalGraph);
  containerIcon?.addEventListener("click", renderGlobalGraph);
});
`;var graph_default=`
.graph > h3 {
  font-size: 1rem;
  margin: 0;
}
.graph > .graph-outer {
  border-radius: 5px;
  border: 1px solid var(--lightgray);
  box-sizing: border-box;
  height: 250px;
  margin: 0.5em 0;
  position: relative;
  overflow: hidden;
}
.graph > .graph-outer > #global-graph-icon {
  color: var(--dark);
  opacity: 0.5;
  width: 18px;
  height: 18px;
  position: absolute;
  padding: 0.2rem;
  margin: 0.3rem;
  top: 0;
  right: 0;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color 0.5s ease;
  cursor: pointer;
}
.graph > .graph-outer > #global-graph-icon:hover {
  background-color: var(--lightgray);
}
.graph > #global-graph-outer {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  backdrop-filter: blur(4px);
  display: none;
  overflow: hidden;
}
.graph > #global-graph-outer.active {
  display: inline-block;
}
.graph > #global-graph-outer > #global-graph-container {
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 60vh;
  width: 50vw;
}
@media all and (max-width: 1510px) {
  .graph > #global-graph-outer > #global-graph-container {
    width: 90%;
  }
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsiZ3JhcGguc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHRTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0VBQ0U7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBWkY7SUFhSSIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG4uZ3JhcGgge1xuICAmID4gaDMge1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAmID4gLmdyYXBoLW91dGVyIHtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGhlaWdodDogMjUwcHg7XG4gICAgbWFyZ2luOiAwLjVlbSAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgJiA+ICNnbG9iYWwtZ3JhcGgtaWNvbiB7XG4gICAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgICB3aWR0aDogMThweDtcbiAgICAgIGhlaWdodDogMThweDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHBhZGRpbmc6IDAuMnJlbTtcbiAgICAgIG1hcmdpbjogMC4zcmVtO1xuICAgICAgdG9wOiAwO1xuICAgICAgcmlnaHQ6IDA7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC41cyBlYXNlO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJiA+ICNnbG9iYWwtZ3JhcGgtb3V0ZXIge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGxlZnQ6IDA7XG4gICAgdG9wOiAwO1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgJi5hY3RpdmUge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cblxuICAgICYgPiAjZ2xvYmFsLWdyYXBoLWNvbnRhaW5lciB7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgIHRvcDogNTAlO1xuICAgICAgbGVmdDogNTAlO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICBoZWlnaHQ6IDYwdmg7XG4gICAgICB3aWR0aDogNTB2dztcblxuICAgICAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICAgICAgd2lkdGg6IDkwJTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;import{jsx as jsx22,jsxs as jsxs12}from"preact/jsx-runtime";var defaultOptions9={localGraph:{drag:!0,zoom:!0,depth:1,scale:1.1,repelForce:.5,centerForce:.3,linkDistance:30,fontSize:.6,opacityScale:1},globalGraph:{drag:!0,zoom:!0,depth:-1,scale:.9,repelForce:.5,centerForce:.3,linkDistance:30,fontSize:.6,opacityScale:1}},Graph_default=__name(opts=>{function Graph(){let localGraph={...defaultOptions9.localGraph,...opts?.localGraph},globalGraph={...defaultOptions9.globalGraph,...opts?.globalGraph};return jsxs12("div",{class:"graph",children:[jsx22("h3",{children:"Graph View"}),jsxs12("div",{class:"graph-outer",children:[jsx22("div",{id:"graph-container","data-cfg":JSON.stringify(localGraph)}),jsx22("svg",{version:"1.1",id:"global-graph-icon",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",x:"0px",y:"0px",viewBox:"0 0 55 55",fill:"currentColor",xmlSpace:"preserve",children:jsx22("path",{d:`M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17
	s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4
	c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562
	C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829
	c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91
	v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4
	s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665
	C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z M11,9c0-1.103,0.897-2,2-2s2,0.897,2,2s-0.897,2-2,2
	S11,10.103,11,9z M6,51c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S8.206,51,6,51z M33,49c0,2.206-1.794,4-4,4s-4-1.794-4-4
	s1.794-4,4-4S33,46.794,33,49z M29,31c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S32.309,31,29,31z M47,41c0,1.103-0.897,2-2,2
	s-2-0.897-2-2s0.897-2,2-2S47,39.897,47,41z M49,10c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S51.206,10,49,10z`})})]}),jsx22("div",{id:"global-graph-outer",children:jsx22("div",{id:"global-graph-container","data-cfg":JSON.stringify(globalGraph)})})]})}return __name(Graph,"Graph"),Graph.css=graph_default,Graph.afterDOMLoaded=graph_inline_default,Graph},"default");var backlinks_default=`
.backlinks {
  position: relative;
}
.backlinks > h3 {
  font-size: 1rem;
  margin: 0;
}
.backlinks > ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}
.backlinks > ul > li > a {
  background-color: transparent;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsiYmFja2xpbmtzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0U7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbIi5iYWNrbGlua3Mge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgJiA+IGgzIHtcbiAgICBmb250LXNpemU6IDFyZW07XG4gICAgbWFyZ2luOiAwO1xuICB9XG5cbiAgJiA+IHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwLjVyZW0gMDtcblxuICAgICYgPiBsaSB7XG4gICAgICAmID4gYSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;import{jsx as jsx23,jsxs as jsxs13}from"preact/jsx-runtime";function Backlinks({fileData,allFiles}){let slug2=simplifySlug(fileData.slug),backlinkFiles=allFiles.filter(file=>file.links?.includes(slug2));return jsxs13("div",{class:"backlinks",children:[jsx23("h3",{children:"Backlinks"}),jsx23("ul",{class:"overflow",children:backlinkFiles.length>0?backlinkFiles.map(f=>jsx23("li",{children:jsx23("a",{href:resolveRelative(fileData.slug,f.slug),class:"internal",children:f.frontmatter?.title})})):jsx23("li",{children:"No backlinks found"})})]})}__name(Backlinks,"Backlinks");Backlinks.css=backlinks_default;var Backlinks_default=__name(()=>Backlinks,"default");var search_default=`
.search {
  min-width: fit-content;
  max-width: 14rem;
  flex-grow: 0.3;
}
.search > #search-icon {
  background-color: var(--lightgray);
  border-radius: 4px;
  height: 2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}
.search > #search-icon > div {
  flex-grow: 1;
}
.search > #search-icon > p {
  display: inline;
  padding: 0 1rem;
}
.search > #search-icon svg {
  cursor: pointer;
  width: 18px;
  min-width: 18px;
  margin: 0 0.5rem;
}
.search > #search-icon svg .search-path {
  stroke: var(--darkgray);
  stroke-width: 2px;
  transition: stroke 0.5s ease;
}
.search > #search-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: none;
  backdrop-filter: blur(4px);
}
.search > #search-container.active {
  display: inline-block;
}
.search > #search-container > #search-space {
  width: 50%;
  margin-top: 15vh;
  margin-left: auto;
  margin-right: auto;
}
@media all and (max-width: 1510px) {
  .search > #search-container > #search-space {
    width: 90%;
  }
}
.search > #search-container > #search-space > * {
  width: 100%;
  border-radius: 5px;
  background: var(--light);
  box-shadow: 0 14px 50px rgba(27, 33, 48, 0.12), 0 10px 30px rgba(27, 33, 48, 0.16);
  margin-bottom: 2em;
}
.search > #search-container > #search-space > input {
  box-sizing: border-box;
  padding: 0.5em 1em;
  font-family: var(--bodyFont);
  color: var(--dark);
  font-size: 1.1em;
  border: 1px solid var(--lightgray);
}
.search > #search-container > #search-space > input:focus {
  outline: none;
}
.search > #search-container > #search-space > #results-container .result-card {
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 1px solid var(--lightgray);
  border-bottom: none;
  width: 100%;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  text-align: left;
  background: var(--light);
  outline: none;
}
.search > #search-container > #search-space > #results-container .result-card .highlight {
  color: var(--secondary);
  font-weight: 700;
}
.search > #search-container > #search-space > #results-container .result-card:hover, .search > #search-container > #search-space > #results-container .result-card:focus {
  background: var(--lightgray);
}
.search > #search-container > #search-space > #results-container .result-card:first-of-type {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.search > #search-container > #search-space > #results-container .result-card:last-of-type {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom: 1px solid var(--lightgray);
}
.search > #search-container > #search-space > #results-container .result-card > h3 {
  margin: 0;
}
.search > #search-container > #search-space > #results-container .result-card > ul > li {
  margin: 0;
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}
.search > #search-container > #search-space > #results-container .result-card > ul {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 0;
  margin-top: 0.45rem;
  margin-left: -2px;
  overflow: hidden;
  background-clip: border-box;
}
.search > #search-container > #search-space > #results-container .result-card > ul > li > p {
  border-radius: 8px;
  background-color: var(--highlight);
  overflow: hidden;
  background-clip: border-box;
  padding: 0.03rem 0.4rem;
  margin: 0;
  color: var(--secondary);
  opacity: 0.85;
}
.search > #search-container > #search-space > #results-container .result-card > ul > li > .match-tag {
  color: var(--tertiary);
  font-weight: bold;
  opacity: 1;
}
.search > #search-container > #search-space > #results-container .result-card > p {
  margin-bottom: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsic2VhcmNoLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUtOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBTkY7SUFPSTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQSxZQUNFO0VBRUY7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFLRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUdBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBRUU7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBRUE7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5cbi5zZWFyY2gge1xuICBtaW4td2lkdGg6IGZpdC1jb250ZW50O1xuICBtYXgtd2lkdGg6IDE0cmVtO1xuICBmbGV4LWdyb3c6IDAuMztcblxuICAmID4gI3NlYXJjaC1pY29uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodGdyYXkpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBoZWlnaHQ6IDJyZW07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuXG4gICAgJiA+IGRpdiB7XG4gICAgICBmbGV4LWdyb3c6IDE7XG4gICAgfVxuXG4gICAgJiA+IHAge1xuICAgICAgZGlzcGxheTogaW5saW5lO1xuICAgICAgcGFkZGluZzogMCAxcmVtO1xuICAgIH1cblxuICAgICYgc3ZnIHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHdpZHRoOiAxOHB4O1xuICAgICAgbWluLXdpZHRoOiAxOHB4O1xuICAgICAgbWFyZ2luOiAwIDAuNXJlbTtcblxuICAgICAgLnNlYXJjaC1wYXRoIHtcbiAgICAgICAgc3Ryb2tlOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgICAgIHN0cm9rZS13aWR0aDogMnB4O1xuICAgICAgICB0cmFuc2l0aW9uOiBzdHJva2UgMC41cyBlYXNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICYgPiAjc2VhcmNoLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGNvbnRhaW46IGxheW91dDtcbiAgICB6LWluZGV4OiA5OTk7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xuXG4gICAgJi5hY3RpdmUge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cblxuICAgICYgPiAjc2VhcmNoLXNwYWNlIHtcbiAgICAgIHdpZHRoOiA1MCU7XG4gICAgICBtYXJnaW4tdG9wOiAxNXZoO1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG5cbiAgICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICAgIHdpZHRoOiA5MCU7XG4gICAgICB9XG5cbiAgICAgICYgPiAqIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHQpO1xuICAgICAgICBib3gtc2hhZG93OlxuICAgICAgICAgIDAgMTRweCA1MHB4IHJnYmEoMjcsIDMzLCA0OCwgMC4xMiksXG4gICAgICAgICAgMCAxMHB4IDMwcHggcmdiYSgyNywgMzMsIDQ4LCAwLjE2KTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMmVtO1xuICAgICAgfVxuXG4gICAgICAmID4gaW5wdXQge1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBwYWRkaW5nOiAwLjVlbSAxZW07XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1ib2R5Rm9udCk7XG4gICAgICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICAgICAgZm9udC1zaXplOiAxLjFlbTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcblxuICAgICAgICAmOmZvY3VzIHtcbiAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICYgPiAjcmVzdWx0cy1jb250YWluZXIge1xuICAgICAgICAmIC5yZXN1bHQtY2FyZCB7XG4gICAgICAgICAgcGFkZGluZzogMWVtO1xuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMnMgZWFzZTtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgICAvLyBub3JtYWxpemUgYnV0dG9uIHByb3BzXG4gICAgICAgICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgICAgICAgZm9udC1zaXplOiAxMDAlO1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xuICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbiAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0KTtcbiAgICAgICAgICBvdXRsaW5lOiBub25lO1xuXG4gICAgICAgICAgJiAuaGlnaGxpZ2h0IHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAmOmhvdmVyLFxuICAgICAgICAgICY6Zm9jdXMge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAmOmZpcnN0LW9mLXR5cGUge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNXB4O1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDVweDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAmOmxhc3Qtb2YtdHlwZSB7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA1cHg7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogNXB4O1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJiA+IGgzIHtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAmID4gdWwgPiBsaSB7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgb3ZlcmZsb3ctd3JhcDogbm9ybWFsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICYgPiB1bCB7XG4gICAgICAgICAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMDtcbiAgICAgICAgICAgIGdhcDogMC40cmVtO1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMC40NXJlbTtcbiAgICAgICAgICAgIC8vIE9mZnNldCBib3JkZXIgcmFkaXVzXG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogLTJweDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNsaXA6IGJvcmRlci1ib3g7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJiA+IHVsID4gbGkgPiBwIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jbGlwOiBib3JkZXItYm94O1xuICAgICAgICAgICAgcGFkZGluZzogMC4wM3JlbSAwLjRyZW07XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuODU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJiA+IHVsID4gbGkgPiAubWF0Y2gtdGFnIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSk7XG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJiA+IHAge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;var search_inline_default=`var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/flexsearch/dist/flexsearch.bundle.js
var require_flexsearch_bundle = __commonJS({
  "node_modules/flexsearch/dist/flexsearch.bundle.js"(exports, module) {
    (function _f(self) {
      "use strict";
      try {
        if (module)
          self = module;
      } catch (e) {
      }
      self._factory = _f;
      var t;
      function u(a2) {
        return "undefined" !== typeof a2 ? a2 : true;
      }
      function aa(a2) {
        const b2 = Array(a2);
        for (let c2 = 0; c2 < a2; c2++)
          b2[c2] = v();
        return b2;
      }
      function v() {
        return /* @__PURE__ */ Object.create(null);
      }
      function ba(a2, b2) {
        return b2.length - a2.length;
      }
      function x(a2) {
        return "string" === typeof a2;
      }
      function C(a2) {
        return "object" === typeof a2;
      }
      function D(a2) {
        return "function" === typeof a2;
      }
      ;
      function ca(a2, b2) {
        var c2 = da;
        if (a2 && (b2 && (a2 = E(a2, b2)), this.H && (a2 = E(a2, this.H)), this.J && 1 < a2.length && (a2 = E(a2, this.J)), c2 || "" === c2)) {
          a2 = a2.split(c2);
          if (this.filter) {
            b2 = this.filter;
            c2 = a2.length;
            const d2 = [];
            for (let e = 0, f = 0; e < c2; e++) {
              const g = a2[e];
              g && !b2[g] && (d2[f++] = g);
            }
            a2 = d2;
          }
          return a2;
        }
        return a2;
      }
      const da = /[\\p{Z}\\p{S}\\p{P}\\p{C}]+/u, ea = /[\\u0300-\\u036f]/g;
      function fa(a2, b2) {
        const c2 = Object.keys(a2), d2 = c2.length, e = [];
        let f = "", g = 0;
        for (let h = 0, k, m; h < d2; h++)
          k = c2[h], (m = a2[k]) ? (e[g++] = F(b2 ? "(?!\\\\b)" + k + "(\\\\b|_)" : k), e[g++] = m) : f += (f ? "|" : "") + k;
        f && (e[g++] = F(b2 ? "(?!\\\\b)(" + f + ")(\\\\b|_)" : "(" + f + ")"), e[g] = "");
        return e;
      }
      function E(a2, b2) {
        for (let c2 = 0, d2 = b2.length; c2 < d2 && (a2 = a2.replace(b2[c2], b2[c2 + 1]), a2); c2 += 2)
          ;
        return a2;
      }
      function F(a2) {
        return new RegExp(a2, "g");
      }
      function ha(a2) {
        let b2 = "", c2 = "";
        for (let d2 = 0, e = a2.length, f; d2 < e; d2++)
          (f = a2[d2]) !== c2 && (b2 += c2 = f);
        return b2;
      }
      ;
      var ja = { encode: ia, F: false, G: "" };
      function ia(a2) {
        return ca.call(this, ("" + a2).toLowerCase(), false);
      }
      ;
      const ka = {}, G = {};
      function la(a2) {
        I(a2, "add");
        I(a2, "append");
        I(a2, "search");
        I(a2, "update");
        I(a2, "remove");
      }
      function I(a2, b2) {
        a2[b2 + "Async"] = function() {
          const c2 = this, d2 = arguments;
          var e = d2[d2.length - 1];
          let f;
          D(e) && (f = e, delete d2[d2.length - 1]);
          e = new Promise(function(g) {
            setTimeout(function() {
              c2.async = true;
              const h = c2[b2].apply(c2, d2);
              c2.async = false;
              g(h);
            });
          });
          return f ? (e.then(f), this) : e;
        };
      }
      ;
      function ma(a2, b2, c2, d2) {
        const e = a2.length;
        let f = [], g, h, k = 0;
        d2 && (d2 = []);
        for (let m = e - 1; 0 <= m; m--) {
          const n = a2[m], w = n.length, q = v();
          let r = !g;
          for (let l = 0; l < w; l++) {
            const p = n[l], z = p.length;
            if (z)
              for (let B = 0, A, y; B < z; B++)
                if (y = p[B], g) {
                  if (g[y]) {
                    if (!m) {
                      if (c2)
                        c2--;
                      else if (f[k++] = y, k === b2)
                        return f;
                    }
                    if (m || d2)
                      q[y] = 1;
                    r = true;
                  }
                  if (d2 && (h[y] = (A = h[y]) ? ++A : A = 1, A < e)) {
                    const H = d2[A - 2] || (d2[A - 2] = []);
                    H[H.length] = y;
                  }
                } else
                  q[y] = 1;
          }
          if (d2)
            g || (h = q);
          else if (!r)
            return [];
          g = q;
        }
        if (d2)
          for (let m = d2.length - 1, n, w; 0 <= m; m--) {
            n = d2[m];
            w = n.length;
            for (let q = 0, r; q < w; q++)
              if (r = n[q], !g[r]) {
                if (c2)
                  c2--;
                else if (f[k++] = r, k === b2)
                  return f;
                g[r] = 1;
              }
          }
        return f;
      }
      function na(a2, b2) {
        const c2 = v(), d2 = v(), e = [];
        for (let f = 0; f < a2.length; f++)
          c2[a2[f]] = 1;
        for (let f = 0, g; f < b2.length; f++) {
          g = b2[f];
          for (let h = 0, k; h < g.length; h++)
            k = g[h], c2[k] && !d2[k] && (d2[k] = 1, e[e.length] = k);
        }
        return e;
      }
      ;
      function J(a2) {
        this.l = true !== a2 && a2;
        this.cache = v();
        this.h = [];
      }
      function oa(a2, b2, c2) {
        C(a2) && (a2 = a2.query);
        let d2 = this.cache.get(a2);
        d2 || (d2 = this.search(a2, b2, c2), this.cache.set(a2, d2));
        return d2;
      }
      J.prototype.set = function(a2, b2) {
        if (!this.cache[a2]) {
          var c2 = this.h.length;
          c2 === this.l ? delete this.cache[this.h[c2 - 1]] : c2++;
          for (--c2; 0 < c2; c2--)
            this.h[c2] = this.h[c2 - 1];
          this.h[0] = a2;
        }
        this.cache[a2] = b2;
      };
      J.prototype.get = function(a2) {
        const b2 = this.cache[a2];
        if (this.l && b2 && (a2 = this.h.indexOf(a2))) {
          const c2 = this.h[a2 - 1];
          this.h[a2 - 1] = this.h[a2];
          this.h[a2] = c2;
        }
        return b2;
      };
      const qa = { memory: { charset: "latin:extra", D: 3, B: 4, m: false }, performance: { D: 3, B: 3, s: false, context: { depth: 2, D: 1 } }, match: { charset: "latin:extra", G: "reverse" }, score: { charset: "latin:advanced", D: 20, B: 3, context: { depth: 3, D: 9 } }, "default": {} };
      function ra(a2, b2, c2, d2, e, f) {
        setTimeout(function() {
          const g = a2(c2, JSON.stringify(f));
          g && g.then ? g.then(function() {
            b2.export(a2, b2, c2, d2, e + 1);
          }) : b2.export(a2, b2, c2, d2, e + 1);
        });
      }
      ;
      function K(a2, b2) {
        if (!(this instanceof K))
          return new K(a2);
        var c2;
        if (a2) {
          x(a2) ? a2 = qa[a2] : (c2 = a2.preset) && (a2 = Object.assign({}, c2[c2], a2));
          c2 = a2.charset;
          var d2 = a2.lang;
          x(c2) && (-1 === c2.indexOf(":") && (c2 += ":default"), c2 = G[c2]);
          x(d2) && (d2 = ka[d2]);
        } else
          a2 = {};
        let e, f, g = a2.context || {};
        this.encode = a2.encode || c2 && c2.encode || ia;
        this.register = b2 || v();
        this.D = e = a2.resolution || 9;
        this.G = b2 = c2 && c2.G || a2.tokenize || "strict";
        this.depth = "strict" === b2 && g.depth;
        this.l = u(g.bidirectional);
        this.s = f = u(a2.optimize);
        this.m = u(a2.fastupdate);
        this.B = a2.minlength || 1;
        this.C = a2.boost;
        this.map = f ? aa(e) : v();
        this.A = e = g.resolution || 1;
        this.h = f ? aa(e) : v();
        this.F = c2 && c2.F || a2.rtl;
        this.H = (b2 = a2.matcher || d2 && d2.H) && fa(b2, false);
        this.J = (b2 = a2.stemmer || d2 && d2.J) && fa(b2, true);
        if (c2 = b2 = a2.filter || d2 && d2.filter) {
          c2 = b2;
          d2 = v();
          for (let h = 0, k = c2.length; h < k; h++)
            d2[c2[h]] = 1;
          c2 = d2;
        }
        this.filter = c2;
        this.cache = (b2 = a2.cache) && new J(b2);
      }
      t = K.prototype;
      t.append = function(a2, b2) {
        return this.add(a2, b2, true);
      };
      t.add = function(a2, b2, c2, d2) {
        if (b2 && (a2 || 0 === a2)) {
          if (!d2 && !c2 && this.register[a2])
            return this.update(a2, b2);
          b2 = this.encode(b2);
          if (d2 = b2.length) {
            const m = v(), n = v(), w = this.depth, q = this.D;
            for (let r = 0; r < d2; r++) {
              let l = b2[this.F ? d2 - 1 - r : r];
              var e = l.length;
              if (l && e >= this.B && (w || !n[l])) {
                var f = L(q, d2, r), g = "";
                switch (this.G) {
                  case "full":
                    if (3 < e) {
                      for (f = 0; f < e; f++)
                        for (var h = e; h > f; h--)
                          if (h - f >= this.B) {
                            var k = L(q, d2, r, e, f);
                            g = l.substring(f, h);
                            M(this, n, g, k, a2, c2);
                          }
                      break;
                    }
                  case "reverse":
                    if (2 < e) {
                      for (h = e - 1; 0 < h; h--)
                        g = l[h] + g, g.length >= this.B && M(
                          this,
                          n,
                          g,
                          L(q, d2, r, e, h),
                          a2,
                          c2
                        );
                      g = "";
                    }
                  case "forward":
                    if (1 < e) {
                      for (h = 0; h < e; h++)
                        g += l[h], g.length >= this.B && M(this, n, g, f, a2, c2);
                      break;
                    }
                  default:
                    if (this.C && (f = Math.min(f / this.C(b2, l, r) | 0, q - 1)), M(this, n, l, f, a2, c2), w && 1 < d2 && r < d2 - 1) {
                      for (e = v(), g = this.A, f = l, h = Math.min(w + 1, d2 - r), e[f] = 1, k = 1; k < h; k++)
                        if ((l = b2[this.F ? d2 - 1 - r - k : r + k]) && l.length >= this.B && !e[l]) {
                          e[l] = 1;
                          const p = this.l && l > f;
                          M(this, m, p ? f : l, L(g + (d2 / 2 > g ? 0 : 1), d2, r, h - 1, k - 1), a2, c2, p ? l : f);
                        }
                    }
                }
              }
            }
            this.m || (this.register[a2] = 1);
          }
        }
        return this;
      };
      function L(a2, b2, c2, d2, e) {
        return c2 && 1 < a2 ? b2 + (d2 || 0) <= a2 ? c2 + (e || 0) : (a2 - 1) / (b2 + (d2 || 0)) * (c2 + (e || 0)) + 1 | 0 : 0;
      }
      function M(a2, b2, c2, d2, e, f, g) {
        let h = g ? a2.h : a2.map;
        if (!b2[c2] || g && !b2[c2][g])
          a2.s && (h = h[d2]), g ? (b2 = b2[c2] || (b2[c2] = v()), b2[g] = 1, h = h[g] || (h[g] = v())) : b2[c2] = 1, h = h[c2] || (h[c2] = []), a2.s || (h = h[d2] || (h[d2] = [])), f && -1 !== h.indexOf(e) || (h[h.length] = e, a2.m && (a2 = a2.register[e] || (a2.register[e] = []), a2[a2.length] = h));
      }
      t.search = function(a2, b2, c2) {
        c2 || (!b2 && C(a2) ? (c2 = a2, a2 = c2.query) : C(b2) && (c2 = b2));
        let d2 = [], e;
        let f, g = 0;
        if (c2) {
          b2 = c2.limit;
          g = c2.offset || 0;
          var h = c2.context;
          f = c2.suggest;
        }
        if (a2 && (a2 = this.encode(a2), e = a2.length, 1 < e)) {
          c2 = v();
          var k = [];
          for (let n = 0, w = 0, q; n < e; n++)
            if ((q = a2[n]) && q.length >= this.B && !c2[q])
              if (this.s || f || this.map[q])
                k[w++] = q, c2[q] = 1;
              else
                return d2;
          a2 = k;
          e = a2.length;
        }
        if (!e)
          return d2;
        b2 || (b2 = 100);
        h = this.depth && 1 < e && false !== h;
        c2 = 0;
        let m;
        h ? (m = a2[0], c2 = 1) : 1 < e && a2.sort(ba);
        for (let n, w; c2 < e; c2++) {
          w = a2[c2];
          h ? (n = sa(this, d2, f, b2, g, 2 === e, w, m), f && false === n && d2.length || (m = w)) : n = sa(this, d2, f, b2, g, 1 === e, w);
          if (n)
            return n;
          if (f && c2 === e - 1) {
            k = d2.length;
            if (!k) {
              if (h) {
                h = 0;
                c2 = -1;
                continue;
              }
              return d2;
            }
            if (1 === k)
              return ta(d2[0], b2, g);
          }
        }
        return ma(d2, b2, g, f);
      };
      function sa(a2, b2, c2, d2, e, f, g, h) {
        let k = [], m = h ? a2.h : a2.map;
        a2.s || (m = ua(m, g, h, a2.l));
        if (m) {
          let n = 0;
          const w = Math.min(m.length, h ? a2.A : a2.D);
          for (let q = 0, r = 0, l, p; q < w; q++)
            if (l = m[q]) {
              if (a2.s && (l = ua(l, g, h, a2.l)), e && l && f && (p = l.length, p <= e ? (e -= p, l = null) : (l = l.slice(e), e = 0)), l && (k[n++] = l, f && (r += l.length, r >= d2)))
                break;
            }
          if (n) {
            if (f)
              return ta(k, d2, 0);
            b2[b2.length] = k;
            return;
          }
        }
        return !c2 && k;
      }
      function ta(a2, b2, c2) {
        a2 = 1 === a2.length ? a2[0] : [].concat.apply([], a2);
        return c2 || a2.length > b2 ? a2.slice(c2, c2 + b2) : a2;
      }
      function ua(a2, b2, c2, d2) {
        c2 ? (d2 = d2 && b2 > c2, a2 = (a2 = a2[d2 ? b2 : c2]) && a2[d2 ? c2 : b2]) : a2 = a2[b2];
        return a2;
      }
      t.contain = function(a2) {
        return !!this.register[a2];
      };
      t.update = function(a2, b2) {
        return this.remove(a2).add(a2, b2);
      };
      t.remove = function(a2, b2) {
        const c2 = this.register[a2];
        if (c2) {
          if (this.m)
            for (let d2 = 0, e; d2 < c2.length; d2++)
              e = c2[d2], e.splice(e.indexOf(a2), 1);
          else
            N(this.map, a2, this.D, this.s), this.depth && N(this.h, a2, this.A, this.s);
          b2 || delete this.register[a2];
          if (this.cache) {
            b2 = this.cache;
            for (let d2 = 0, e, f; d2 < b2.h.length; d2++)
              f = b2.h[d2], e = b2.cache[f], -1 !== e.indexOf(a2) && (b2.h.splice(d2--, 1), delete b2.cache[f]);
          }
        }
        return this;
      };
      function N(a2, b2, c2, d2, e) {
        let f = 0;
        if (a2.constructor === Array)
          if (e)
            b2 = a2.indexOf(b2), -1 !== b2 ? 1 < a2.length && (a2.splice(b2, 1), f++) : f++;
          else {
            e = Math.min(a2.length, c2);
            for (let g = 0, h; g < e; g++)
              if (h = a2[g])
                f = N(h, b2, c2, d2, e), d2 || f || delete a2[g];
          }
        else
          for (let g in a2)
            (f = N(a2[g], b2, c2, d2, e)) || delete a2[g];
        return f;
      }
      t.searchCache = oa;
      t.export = function(a2, b2, c2, d2, e) {
        let f, g;
        switch (e || (e = 0)) {
          case 0:
            f = "reg";
            if (this.m) {
              g = v();
              for (let h in this.register)
                g[h] = 1;
            } else
              g = this.register;
            break;
          case 1:
            f = "cfg";
            g = { doc: 0, opt: this.s ? 1 : 0 };
            break;
          case 2:
            f = "map";
            g = this.map;
            break;
          case 3:
            f = "ctx";
            g = this.h;
            break;
          default:
            return;
        }
        ra(a2, b2 || this, c2 ? c2 + "." + f : f, d2, e, g);
        return true;
      };
      t.import = function(a2, b2) {
        if (b2)
          switch (x(b2) && (b2 = JSON.parse(b2)), a2) {
            case "cfg":
              this.s = !!b2.opt;
              break;
            case "reg":
              this.m = false;
              this.register = b2;
              break;
            case "map":
              this.map = b2;
              break;
            case "ctx":
              this.h = b2;
          }
      };
      la(K.prototype);
      function va(a2) {
        a2 = a2.data;
        var b2 = self._index;
        const c2 = a2.args;
        var d2 = a2.task;
        switch (d2) {
          case "init":
            d2 = a2.options || {};
            a2 = a2.factory;
            b2 = d2.encode;
            d2.cache = false;
            b2 && 0 === b2.indexOf("function") && (d2.encode = Function("return " + b2)());
            a2 ? (Function("return " + a2)()(self), self._index = new self.FlexSearch.Index(d2), delete self.FlexSearch) : self._index = new K(d2);
            break;
          default:
            a2 = a2.id, b2 = b2[d2].apply(b2, c2), postMessage("search" === d2 ? { id: a2, msg: b2 } : { id: a2 });
        }
      }
      ;
      let wa = 0;
      function O(a2) {
        if (!(this instanceof O))
          return new O(a2);
        var b2;
        a2 ? D(b2 = a2.encode) && (a2.encode = b2.toString()) : a2 = {};
        (b2 = (self || window)._factory) && (b2 = b2.toString());
        const c2 = self.exports, d2 = this;
        this.o = xa(b2, c2, a2.worker);
        this.h = v();
        if (this.o) {
          if (c2)
            this.o.on("message", function(e) {
              d2.h[e.id](e.msg);
              delete d2.h[e.id];
            });
          else
            this.o.onmessage = function(e) {
              e = e.data;
              d2.h[e.id](e.msg);
              delete d2.h[e.id];
            };
          this.o.postMessage({ task: "init", factory: b2, options: a2 });
        }
      }
      P("add");
      P("append");
      P("search");
      P("update");
      P("remove");
      function P(a2) {
        O.prototype[a2] = O.prototype[a2 + "Async"] = function() {
          const b2 = this, c2 = [].slice.call(arguments);
          var d2 = c2[c2.length - 1];
          let e;
          D(d2) && (e = d2, c2.splice(c2.length - 1, 1));
          d2 = new Promise(function(f) {
            setTimeout(function() {
              b2.h[++wa] = f;
              b2.o.postMessage({ task: a2, id: wa, args: c2 });
            });
          });
          return e ? (d2.then(e), this) : d2;
        };
      }
      function xa(a, b, c) {
        let d;
        try {
          d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + va.toString()], { type: "text/javascript" }))) : new Worker(x(c) ? c : "worker/worker.js", { type: "module" });
        } catch (e) {
        }
        return d;
      }
      ;
      function Q(a2) {
        if (!(this instanceof Q))
          return new Q(a2);
        var b2 = a2.document || a2.doc || a2, c2;
        this.K = [];
        this.h = [];
        this.A = [];
        this.register = v();
        this.key = (c2 = b2.key || b2.id) && S(c2, this.A) || "id";
        this.m = u(a2.fastupdate);
        this.C = (c2 = b2.store) && true !== c2 && [];
        this.store = c2 && v();
        this.I = (c2 = b2.tag) && S(c2, this.A);
        this.l = c2 && v();
        this.cache = (c2 = a2.cache) && new J(c2);
        a2.cache = false;
        this.o = a2.worker;
        this.async = false;
        c2 = v();
        let d2 = b2.index || b2.field || b2;
        x(d2) && (d2 = [d2]);
        for (let e = 0, f, g; e < d2.length; e++)
          f = d2[e], x(f) || (g = f, f = f.field), g = C(g) ? Object.assign({}, a2, g) : a2, this.o && (c2[f] = new O(g), c2[f].o || (this.o = false)), this.o || (c2[f] = new K(g, this.register)), this.K[e] = S(f, this.A), this.h[e] = f;
        if (this.C)
          for (a2 = b2.store, x(a2) && (a2 = [a2]), b2 = 0; b2 < a2.length; b2++)
            this.C[b2] = S(a2[b2], this.A);
        this.index = c2;
      }
      function S(a2, b2) {
        const c2 = a2.split(":");
        let d2 = 0;
        for (let e = 0; e < c2.length; e++)
          a2 = c2[e], 0 <= a2.indexOf("[]") && (a2 = a2.substring(0, a2.length - 2)) && (b2[d2] = true), a2 && (c2[d2++] = a2);
        d2 < c2.length && (c2.length = d2);
        return 1 < d2 ? c2 : c2[0];
      }
      function T(a2, b2) {
        if (x(b2))
          a2 = a2[b2];
        else
          for (let c2 = 0; a2 && c2 < b2.length; c2++)
            a2 = a2[b2[c2]];
        return a2;
      }
      function U(a2, b2, c2, d2, e) {
        a2 = a2[e];
        if (d2 === c2.length - 1)
          b2[e] = a2;
        else if (a2)
          if (a2.constructor === Array)
            for (b2 = b2[e] = Array(a2.length), e = 0; e < a2.length; e++)
              U(a2, b2, c2, d2, e);
          else
            b2 = b2[e] || (b2[e] = v()), e = c2[++d2], U(a2, b2, c2, d2, e);
      }
      function V(a2, b2, c2, d2, e, f, g, h) {
        if (a2 = a2[g])
          if (d2 === b2.length - 1) {
            if (a2.constructor === Array) {
              if (c2[d2]) {
                for (b2 = 0; b2 < a2.length; b2++)
                  e.add(f, a2[b2], true, true);
                return;
              }
              a2 = a2.join(" ");
            }
            e.add(f, a2, h, true);
          } else if (a2.constructor === Array)
            for (g = 0; g < a2.length; g++)
              V(a2, b2, c2, d2, e, f, g, h);
          else
            g = b2[++d2], V(a2, b2, c2, d2, e, f, g, h);
      }
      t = Q.prototype;
      t.add = function(a2, b2, c2) {
        C(a2) && (b2 = a2, a2 = T(b2, this.key));
        if (b2 && (a2 || 0 === a2)) {
          if (!c2 && this.register[a2])
            return this.update(a2, b2);
          for (let d2 = 0, e, f; d2 < this.h.length; d2++)
            f = this.h[d2], e = this.K[d2], x(e) && (e = [e]), V(b2, e, this.A, 0, this.index[f], a2, e[0], c2);
          if (this.I) {
            let d2 = T(b2, this.I), e = v();
            x(d2) && (d2 = [d2]);
            for (let f = 0, g, h; f < d2.length; f++)
              if (g = d2[f], !e[g] && (e[g] = 1, h = this.l[g] || (this.l[g] = []), !c2 || -1 === h.indexOf(a2))) {
                if (h[h.length] = a2, this.m) {
                  const k = this.register[a2] || (this.register[a2] = []);
                  k[k.length] = h;
                }
              }
          }
          if (this.store && (!c2 || !this.store[a2])) {
            let d2;
            if (this.C) {
              d2 = v();
              for (let e = 0, f; e < this.C.length; e++)
                f = this.C[e], x(f) ? d2[f] = b2[f] : U(b2, d2, f, 0, f[0]);
            }
            this.store[a2] = d2 || b2;
          }
        }
        return this;
      };
      t.append = function(a2, b2) {
        return this.add(a2, b2, true);
      };
      t.update = function(a2, b2) {
        return this.remove(a2).add(a2, b2);
      };
      t.remove = function(a2) {
        C(a2) && (a2 = T(a2, this.key));
        if (this.register[a2]) {
          for (var b2 = 0; b2 < this.h.length && (this.index[this.h[b2]].remove(a2, !this.o), !this.m); b2++)
            ;
          if (this.I && !this.m)
            for (let c2 in this.l) {
              b2 = this.l[c2];
              const d2 = b2.indexOf(a2);
              -1 !== d2 && (1 < b2.length ? b2.splice(d2, 1) : delete this.l[c2]);
            }
          this.store && delete this.store[a2];
          delete this.register[a2];
        }
        return this;
      };
      t.search = function(a2, b2, c2, d2) {
        c2 || (!b2 && C(a2) ? (c2 = a2, a2 = c2.query) : C(b2) && (c2 = b2, b2 = 0));
        let e = [], f = [], g, h, k, m, n, w, q = 0;
        if (c2)
          if (c2.constructor === Array)
            k = c2, c2 = null;
          else {
            k = (g = c2.pluck) || c2.index || c2.field;
            m = c2.tag;
            h = this.store && c2.enrich;
            n = "and" === c2.bool;
            b2 = c2.limit || 100;
            w = c2.offset || 0;
            if (m && (x(m) && (m = [m]), !a2)) {
              for (let l = 0, p; l < m.length; l++)
                if (p = ya.call(this, m[l], b2, w, h))
                  e[e.length] = p, q++;
              return q ? e : [];
            }
            x(k) && (k = [k]);
          }
        k || (k = this.h);
        n = n && (1 < k.length || m && 1 < m.length);
        const r = !d2 && (this.o || this.async) && [];
        for (let l = 0, p, z, B; l < k.length; l++) {
          let A;
          z = k[l];
          x(z) || (A = z, z = z.field);
          if (r)
            r[l] = this.index[z].searchAsync(a2, b2, A || c2);
          else {
            d2 ? p = d2[l] : p = this.index[z].search(a2, b2, A || c2);
            B = p && p.length;
            if (m && B) {
              const y = [];
              let H = 0;
              n && (y[0] = [p]);
              for (let X = 0, pa, R; X < m.length; X++)
                if (pa = m[X], B = (R = this.l[pa]) && R.length)
                  H++, y[y.length] = n ? [R] : R;
              H && (p = n ? ma(y, b2 || 100, w || 0) : na(p, y), B = p.length);
            }
            if (B)
              f[q] = z, e[q++] = p;
            else if (n)
              return [];
          }
        }
        if (r) {
          const l = this;
          return new Promise(function(p) {
            Promise.all(r).then(function(z) {
              p(l.search(a2, b2, c2, z));
            });
          });
        }
        if (!q)
          return [];
        if (g && (!h || !this.store))
          return e[0];
        for (let l = 0, p; l < f.length; l++) {
          p = e[l];
          p.length && h && (p = za.call(this, p));
          if (g)
            return p;
          e[l] = { field: f[l], result: p };
        }
        return e;
      };
      function ya(a2, b2, c2, d2) {
        let e = this.l[a2], f = e && e.length - c2;
        if (f && 0 < f) {
          if (f > b2 || c2)
            e = e.slice(c2, c2 + b2);
          d2 && (e = za.call(this, e));
          return { tag: a2, result: e };
        }
      }
      function za(a2) {
        const b2 = Array(a2.length);
        for (let c2 = 0, d2; c2 < a2.length; c2++)
          d2 = a2[c2], b2[c2] = { id: d2, doc: this.store[d2] };
        return b2;
      }
      t.contain = function(a2) {
        return !!this.register[a2];
      };
      t.get = function(a2) {
        return this.store[a2];
      };
      t.set = function(a2, b2) {
        this.store[a2] = b2;
        return this;
      };
      t.searchCache = oa;
      t.export = function(a2, b2, c2, d2, e) {
        e || (e = 0);
        d2 || (d2 = 0);
        if (d2 < this.h.length) {
          const f = this.h[d2], g = this.index[f];
          b2 = this;
          setTimeout(function() {
            g.export(a2, b2, e ? f.replace(":", "-") : "", d2, e++) || (d2++, e = 1, b2.export(a2, b2, f, d2, e));
          });
        } else {
          let f;
          switch (e) {
            case 1:
              c2 = "tag";
              f = this.l;
              break;
            case 2:
              c2 = "store";
              f = this.store;
              break;
            default:
              return;
          }
          ra(a2, this, c2, d2, e, f);
        }
      };
      t.import = function(a2, b2) {
        if (b2)
          switch (x(b2) && (b2 = JSON.parse(b2)), a2) {
            case "tag":
              this.l = b2;
              break;
            case "reg":
              this.m = false;
              this.register = b2;
              for (let d2 = 0, e; d2 < this.h.length; d2++)
                e = this.index[this.h[d2]], e.register = b2, e.m = false;
              break;
            case "store":
              this.store = b2;
              break;
            default:
              a2 = a2.split(".");
              const c2 = a2[0];
              a2 = a2[1];
              c2 && a2 && this.index[c2].import(a2, b2);
          }
      };
      la(Q.prototype);
      var Ba = { encode: Aa, F: false, G: "" };
      const Ca = [F("[\\xE0\\xE1\\xE2\\xE3\\xE4\\xE5]"), "a", F("[\\xE8\\xE9\\xEA\\xEB]"), "e", F("[\\xEC\\xED\\xEE\\xEF]"), "i", F("[\\xF2\\xF3\\xF4\\xF5\\xF6\\u0151]"), "o", F("[\\xF9\\xFA\\xFB\\xFC\\u0171]"), "u", F("[\\xFD\\u0177\\xFF]"), "y", F("\\xF1"), "n", F("[\\xE7c]"), "k", F("\\xDF"), "s", F(" & "), " and "];
      function Aa(a2) {
        var b2 = a2;
        b2.normalize && (b2 = b2.normalize("NFD").replace(ea, ""));
        return ca.call(this, b2.toLowerCase(), !a2.normalize && Ca);
      }
      ;
      var Ea = { encode: Da, F: false, G: "strict" };
      const Fa = /[^a-z0-9]+/, Ga = { b: "p", v: "f", w: "f", z: "s", x: "s", "\\xDF": "s", d: "t", n: "m", c: "k", g: "k", j: "k", q: "k", i: "e", y: "e", u: "o" };
      function Da(a2) {
        a2 = Aa.call(this, a2).join(" ");
        const b2 = [];
        if (a2) {
          const c2 = a2.split(Fa), d2 = c2.length;
          for (let e = 0, f, g = 0; e < d2; e++)
            if ((a2 = c2[e]) && (!this.filter || !this.filter[a2])) {
              f = a2[0];
              let h = Ga[f] || f, k = h;
              for (let m = 1; m < a2.length; m++) {
                f = a2[m];
                const n = Ga[f] || f;
                n && n !== k && (h += n, k = n);
              }
              b2[g++] = h;
            }
        }
        return b2;
      }
      ;
      var Ia = { encode: Ha, F: false, G: "" };
      const Ja = [F("ae"), "a", F("oe"), "o", F("sh"), "s", F("th"), "t", F("ph"), "f", F("pf"), "f", F("(?![aeo])h(?![aeo])"), "", F("(?!^[aeo])h(?!^[aeo])"), ""];
      function Ha(a2, b2) {
        a2 && (a2 = Da.call(this, a2).join(" "), 2 < a2.length && (a2 = E(a2, Ja)), b2 || (1 < a2.length && (a2 = ha(a2)), a2 && (a2 = a2.split(" "))));
        return a2;
      }
      ;
      var La = { encode: Ka, F: false, G: "" };
      const Ma = F("(?!\\\\b)[aeo]");
      function Ka(a2) {
        a2 && (a2 = Ha.call(this, a2, true), 1 < a2.length && (a2 = a2.replace(Ma, "")), 1 < a2.length && (a2 = ha(a2)), a2 && (a2 = a2.split(" ")));
        return a2;
      }
      ;
      G["latin:default"] = ja;
      G["latin:simple"] = Ba;
      G["latin:balance"] = Ea;
      G["latin:advanced"] = Ia;
      G["latin:extra"] = La;
      const W = self;
      let Y;
      const Z = { Index: K, Document: Q, Worker: O, registerCharset: function(a2, b2) {
        G[a2] = b2;
      }, registerLanguage: function(a2, b2) {
        ka[a2] = b2;
      } };
      (Y = W.define) && Y.amd ? Y([], function() {
        return Z;
      }) : W.exports ? W.exports = Z : W.FlexSearch = Z;
    })(exports);
  }
});

// quartz/components/scripts/quartz/components/scripts/search.inline.ts
var import_flexsearch = __toESM(require_flexsearch_bundle());

// quartz/components/scripts/util.ts
function registerEscapeHandler(outsideContainer, cb) {
  if (!outsideContainer)
    return;
  function click(e) {
    if (e.target !== this)
      return;
    e.preventDefault();
    cb();
  }
  function esc(e) {
    if (!e.key.startsWith("Esc"))
      return;
    e.preventDefault();
    cb();
  }
  outsideContainer?.removeEventListener("click", click);
  outsideContainer?.addEventListener("click", click);
  document.removeEventListener("keydown", esc);
  document.addEventListener("keydown", esc);
}
function removeAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
function simplifySlug(fp) {
  return _stripSlashes(_trimSuffix(fp, "index"), true);
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}
function joinSegments(...args) {
  return args.filter((segment) => segment !== "").join("/");
}
function _endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function _trimSuffix(s, suffix) {
  if (_endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function _stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}

// quartz/components/scripts/quartz/components/scripts/search.inline.ts
var index = void 0;
var searchType = "basic";
var contextWindowWords = 30;
var numSearchResults = 5;
var numTagResults = 3;
function highlight(searchTerm, text, trim) {
  const tokenizedTerms = searchTerm.split(/\\s+/).filter((t2) => t2 !== "").sort((a2, b2) => b2.length - a2.length);
  let tokenizedText = text.split(/\\s+/).filter((t2) => t2 !== "");
  let startIndex = 0;
  let endIndex = tokenizedText.length - 1;
  if (trim) {
    const includesCheck = (tok) => tokenizedTerms.some((term) => tok.toLowerCase().startsWith(term.toLowerCase()));
    const occurencesIndices = tokenizedText.map(includesCheck);
    let bestSum = 0;
    let bestIndex = 0;
    for (let i = 0; i < Math.max(tokenizedText.length - contextWindowWords, 0); i++) {
      const window2 = occurencesIndices.slice(i, i + contextWindowWords);
      const windowSum = window2.reduce((total, cur) => total + (cur ? 1 : 0), 0);
      if (windowSum >= bestSum) {
        bestSum = windowSum;
        bestIndex = i;
      }
    }
    startIndex = Math.max(bestIndex - contextWindowWords, 0);
    endIndex = Math.min(startIndex + 2 * contextWindowWords, tokenizedText.length - 1);
    tokenizedText = tokenizedText.slice(startIndex, endIndex);
  }
  const slice = tokenizedText.map((tok) => {
    for (const searchTok of tokenizedTerms) {
      if (tok.toLowerCase().includes(searchTok.toLowerCase())) {
        const regex2 = new RegExp(searchTok.toLowerCase(), "gi");
        return tok.replace(regex2, \`<span class="highlight">$&</span>\`);
      }
    }
    return tok;
  }).join(" ");
  return \`\${startIndex === 0 ? "" : "..."}\${slice}\${endIndex === tokenizedText.length - 1 ? "" : "..."}\`;
}
var encoder = (str) => str.toLowerCase().split(/([^a-z]|[^\\x00-\\x7F])/);
var prevShortcutHandler = void 0;
document.addEventListener("nav", async (e) => {
  const currentSlug = e.detail.url;
  const data = await fetchData;
  const container = document.getElementById("search-container");
  const sidebar = container?.closest(".sidebar");
  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.getElementById("search-bar");
  const results = document.getElementById("results-container");
  const resultCards = document.getElementsByClassName("result-card");
  const idDataMap = Object.keys(data);
  function hideSearch() {
    container?.classList.remove("active");
    if (searchBar) {
      searchBar.value = "";
    }
    if (sidebar) {
      sidebar.style.zIndex = "unset";
    }
    if (results) {
      removeAllChildren(results);
    }
    searchType = "basic";
  }
  function showSearch(searchTypeNew) {
    searchType = searchTypeNew;
    if (sidebar) {
      sidebar.style.zIndex = "1";
    }
    container?.classList.add("active");
    searchBar?.focus();
  }
  function shortcutHandler(e2) {
    if (e2.key === "k" && (e2.ctrlKey || e2.metaKey) && !e2.shiftKey) {
      e2.preventDefault();
      const searchBarOpen = container?.classList.contains("active");
      searchBarOpen ? hideSearch() : showSearch("basic");
    } else if (e2.shiftKey && (e2.ctrlKey || e2.metaKey) && e2.key.toLowerCase() === "k") {
      e2.preventDefault();
      const searchBarOpen = container?.classList.contains("active");
      searchBarOpen ? hideSearch() : showSearch("tags");
      if (searchBar)
        searchBar.value = "#";
    } else if (e2.key === "Enter") {
      if (results?.contains(document.activeElement)) {
        const active = document.activeElement;
        active.click();
      } else {
        const anchor = document.getElementsByClassName("result-card")[0];
        anchor?.click();
      }
    } else if (e2.key === "ArrowDown") {
      e2.preventDefault();
      if (!results?.contains(document.activeElement)) {
        const firstResult = resultCards[0];
        firstResult?.focus();
      } else {
        const nextResult = document.activeElement?.nextElementSibling;
        nextResult?.focus();
      }
    } else if (e2.key === "ArrowUp") {
      e2.preventDefault();
      if (results?.contains(document.activeElement)) {
        const prevResult = document.activeElement?.previousElementSibling;
        prevResult?.focus();
      }
    }
  }
  function trimContent(content) {
    const sentences = content.replace(/\\s+/g, " ").split(".");
    let finalDesc = "";
    let sentenceIdx = 0;
    const len = contextWindowWords * 5;
    while (finalDesc.length < len) {
      const sentence = sentences[sentenceIdx];
      if (!sentence)
        break;
      finalDesc += sentence + ".";
      sentenceIdx++;
    }
    if (finalDesc.length < content.length) {
      finalDesc += "..";
    }
    return finalDesc;
  }
  const formatForDisplay = (term, id) => {
    const slug2 = idDataMap[id];
    return {
      id,
      slug: slug2,
      title: searchType === "tags" ? data[slug2].title : highlight(term, data[slug2].title ?? ""),
      // if searchType is tag, display context from start of file and trim, otherwise use regular highlight
      content: searchType === "tags" ? trimContent(data[slug2].content) : highlight(term, data[slug2].content ?? "", true),
      tags: highlightTags(term, data[slug2].tags)
    };
  };
  function highlightTags(term, tags) {
    if (tags && searchType === "tags") {
      const termLower = term.toLowerCase();
      let matching = tags.filter((str) => str.includes(termLower));
      if (matching.length > 0) {
        let difference = tags.filter((x2) => !matching.includes(x2));
        matching = matching.map((tag) => \`<li><p class="match-tag">#\${tag}</p></li>\`);
        difference = difference.map((tag) => \`<li><p>#\${tag}</p></li>\`);
        matching.push(...difference);
      }
      if (tags.length > numTagResults) {
        matching.splice(numTagResults);
      }
      return matching;
    } else {
      return [];
    }
  }
  const resultToHTML = ({ slug: slug2, title, content, tags }) => {
    const htmlTags = tags.length > 0 ? \`<ul>\${tags.join("")}</ul>\` : \`\`;
    const button = document.createElement("button");
    button.classList.add("result-card");
    button.id = slug2;
    button.innerHTML = \`<h3>\${title}</h3>\${htmlTags}<p>\${content}</p>\`;
    button.addEventListener("click", () => {
      const targ = resolveRelative(currentSlug, slug2);
      window.spaNavigate(new URL(targ, window.location.toString()));
      hideSearch();
    });
    return button;
  };
  function displayResults(finalResults) {
    if (!results)
      return;
    removeAllChildren(results);
    if (finalResults.length === 0) {
      results.innerHTML = \`<button class="result-card">
                    <h3>No results.</h3>
                    <p>Try another search term?</p>
                </button>\`;
    } else {
      results.append(...finalResults.map(resultToHTML));
    }
  }
  async function onType(e2) {
    let term = e2.target.value;
    let searchResults;
    if (term.toLowerCase().startsWith("#")) {
      searchType = "tags";
    } else {
      searchType = "basic";
    }
    switch (searchType) {
      case "tags": {
        term = term.substring(1);
        searchResults = await index?.searchAsync({ query: term, limit: numSearchResults, index: ["tags"] }) ?? [];
        break;
      }
      case "basic":
      default: {
        searchResults = await index?.searchAsync({
          query: term,
          limit: numSearchResults,
          index: ["title", "content"]
        }) ?? [];
      }
    }
    const getByField = (field) => {
      const results2 = searchResults.filter((x2) => x2.field === field);
      return results2.length === 0 ? [] : [...results2[0].result];
    };
    const allIds = /* @__PURE__ */ new Set([
      ...getByField("title"),
      ...getByField("content"),
      ...getByField("tags")
    ]);
    const finalResults = [...allIds].map((id) => formatForDisplay(term, id));
    displayResults(finalResults);
  }
  if (prevShortcutHandler) {
    document.removeEventListener("keydown", prevShortcutHandler);
  }
  document.addEventListener("keydown", shortcutHandler);
  prevShortcutHandler = shortcutHandler;
  searchIcon?.removeEventListener("click", () => showSearch("basic"));
  searchIcon?.addEventListener("click", () => showSearch("basic"));
  searchBar?.removeEventListener("input", onType);
  searchBar?.addEventListener("input", onType);
  if (!index) {
    index = new import_flexsearch.Document({
      cache: true,
      charset: "latin:extra",
      optimize: true,
      encode: encoder,
      document: {
        id: "id",
        index: [
          {
            field: "title",
            tokenize: "reverse"
          },
          {
            field: "content",
            tokenize: "reverse"
          },
          {
            field: "tags",
            tokenize: "reverse"
          }
        ]
      }
    });
    fillDocument(index, data);
  }
  registerEscapeHandler(container, hideSearch);
});
async function fillDocument(index2, data) {
  let id = 0;
  for (const [slug2, fileData] of Object.entries(data)) {
    await index2.addAsync(id, {
      id,
      slug: slug2,
      title: fileData.title,
      content: fileData.content,
      tags: fileData.tags
    });
    id++;
  }
}
`;import{jsx as jsx24,jsxs as jsxs14}from"preact/jsx-runtime";var Search_default=__name(()=>{function Search(){return jsxs14("div",{class:"search",children:[jsxs14("div",{id:"search-icon",children:[jsx24("p",{children:"Search"}),jsx24("div",{}),jsxs14("svg",{tabIndex:0,"aria-labelledby":"title desc",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19.9 19.7",children:[jsx24("title",{id:"title",children:"Search"}),jsx24("desc",{id:"desc",children:"Search"}),jsxs14("g",{class:"search-path",fill:"none",children:[jsx24("path",{"stroke-linecap":"square",d:"M18.5 18.3l-5.4-5.4"}),jsx24("circle",{cx:"8",cy:"8",r:"7"})]})]})]}),jsx24("div",{id:"search-container",children:jsxs14("div",{id:"search-space",children:[jsx24("input",{autocomplete:"off",id:"search-bar",name:"search",type:"text","aria-label":"Search for something",placeholder:"Search for something"}),jsx24("div",{id:"results-container"})]})})]})}return __name(Search,"Search"),Search.afterDOMLoaded=search_inline_default,Search.css=search_default,Search},"default");var footer_default=`
footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}
footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: -1rem;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsiZm9vdGVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSIsInNvdXJjZXNDb250ZW50IjpbImZvb3RlciB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIG1hcmdpbi1ib3R0b206IDRyZW07XG4gIG9wYWNpdHk6IDAuNztcblxuICAmIHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBnYXA6IDFyZW07XG4gICAgbWFyZ2luLXRvcDogLTFyZW07XG4gIH1cbn1cbiJdfQ== */`;var version="4.0.10";import{jsx as jsx25,jsxs as jsxs15}from"preact/jsx-runtime";var Footer_default=__name(opts=>{function Footer(){let year=new Date().getFullYear(),links=opts?.links??[];return jsxs15("footer",{children:[jsx25("hr",{}),jsxs15("p",{children:["Created with ",jsxs15("a",{href:"https://quartz.jzhao.xyz/",children:["Quartz v",version]}),", \xA9 ",year]}),jsx25("ul",{children:Object.entries(links).map(([text,link])=>jsx25("li",{children:jsx25("a",{href:link,children:text})}))})]})}return __name(Footer,"Footer"),Footer.css=footer_default,Footer},"default");import{Fragment as Fragment5,jsx as jsx26}from"preact/jsx-runtime";var DesktopOnly_default=__name(component=>{if(component){let DesktopOnly2=function(props){return jsx26(Component,{displayClass:"desktop-only",...props})};var DesktopOnly=DesktopOnly2;__name(DesktopOnly2,"DesktopOnly");let Component=component;return DesktopOnly2.displayName=component.displayName,DesktopOnly2.afterDOMLoaded=component?.afterDOMLoaded,DesktopOnly2.beforeDOMLoaded=component?.beforeDOMLoaded,DesktopOnly2.css=component?.css,DesktopOnly2}else return()=>jsx26(Fragment5,{})},"default");import{Fragment as Fragment6,jsx as jsx27}from"preact/jsx-runtime";var MobileOnly_default=__name(component=>{if(component){let MobileOnly2=function(props){return jsx27(Component,{displayClass:"mobile-only",...props})};var MobileOnly=MobileOnly2;__name(MobileOnly2,"MobileOnly");let Component=component;return MobileOnly2.displayName=component.displayName,MobileOnly2.afterDOMLoaded=component?.afterDOMLoaded,MobileOnly2.beforeDOMLoaded=component?.beforeDOMLoaded,MobileOnly2.css=component?.css,MobileOnly2}else return()=>jsx27(Fragment6,{})},"default");import{jsx as jsx28,jsxs as jsxs16}from"preact/jsx-runtime";var sharedPageComponents={head:Head_default(),header:[],footer:Footer_default({links:{GitHub:"https://github.com/armanjindal",LinkedIn:"https://www.linkedin.com/in/arman-jindal-650a8616b/"}})},defaultContentPageLayout={beforeBody:[ArticleTitle_default(),ContentMeta_default(),TagList_default()],left:[PageTitle_default(),MobileOnly_default(Spacer_default()),Search_default(),Darkmode_default(),DesktopOnly_default(TableOfContents_default())],right:[Graph_default(),Backlinks_default()]},defaultListPageLayout={beforeBody:[ArticleTitle_default()],left:[PageTitle_default(),MobileOnly_default(Spacer_default()),Search_default(),Darkmode_default()],right:[]};var ContentPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultContentPageLayout,pageBody:Content_default(),...userOpts},{head:Head,header,beforeBody,pageBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"ContentPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...left,...right,Footer]},async emit(ctx,content,resources,emit){let cfg=ctx.cfg.configuration,fps=[],allFiles=content.map(c=>c[1].data);for(let[tree,file]of content){let slug2=file.data.slug,externalResources=pageResources(slug2,resources),componentData={fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content2=renderPage(slug2,componentData,opts,externalResources),fp=await emit({content:content2,slug:slug2,ext:".html"});fps.push(fp)}return fps}}},"ContentPage");import{VFile}from"vfile";function defaultProcessedContent(vfileData){let root={type:"root",children:[]},vfile=new VFile("");return vfile.data=vfileData,[root,vfile]}__name(defaultProcessedContent,"defaultProcessedContent");var TagPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:TagContent_default(),...userOpts},{head:Head,header,beforeBody,pageBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"TagPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...left,...right,Footer]},async emit(ctx,content,resources,emit){let fps=[],allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,tags=new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes));tags.add("index");let tagDescriptions=Object.fromEntries([...tags].map(tag=>{let title=tag===""?"Tag Index":`Tag: #${tag}`;return[tag,defaultProcessedContent({slug:joinSegments("tags",tag),frontmatter:{title,tags:[]}})]}));for(let[tree,file]of content){let slug2=file.data.slug;if(slug2.startsWith("tags/")){let tag=slug2.slice(5);tags.has(tag)&&(tagDescriptions[tag]=[tree,file])}}for(let tag of tags){let slug2=joinSegments("tags",tag),externalResources=pageResources(slug2,resources),[tree,file]=tagDescriptions[tag],componentData={fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content2=renderPage(slug2,componentData,opts,externalResources),fp=await emit({content:content2,slug:file.data.slug,ext:".html"});fps.push(fp)}return fps}}},"TagPage");import path6 from"path";var FolderPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:FolderContent_default(),...userOpts},{head:Head,header,beforeBody,pageBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"FolderPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...left,...right,Footer]},async emit(ctx,content,resources,emit){let fps=[],allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,folders=new Set(allFiles.flatMap(data=>{let slug2=data.slug,folderName=path6.dirname(slug2??"");return slug2&&folderName!=="."&&folderName!=="tags"?[folderName]:[]})),folderDescriptions=Object.fromEntries([...folders].map(folder=>[folder,defaultProcessedContent({slug:joinSegments(folder,"index"),frontmatter:{title:`Folder: ${folder}`,tags:[]}})]));for(let[tree,file]of content){let slug2=_stripSlashes(simplifySlug(file.data.slug));folders.has(slug2)&&(folderDescriptions[slug2]=[tree,file])}for(let folder of folders){let slug2=joinSegments(folder,"index"),externalResources=pageResources(slug2,resources),[tree,file]=folderDescriptions[folder],componentData={fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content2=renderPage(slug2,componentData,opts,externalResources),fp=await emit({content:content2,slug:slug2,ext:".html"});fps.push(fp)}return fps}}},"FolderPage");import path7 from"path";var defaultOptions10={enableSiteMap:!0,enableRSS:!0,includeEmptyFiles:!0};function generateSiteMap(cfg,idx){let base=cfg.baseUrl??"",createURLEntry=__name((slug2,content)=>`<url>
    <loc>https://${base}/${encodeURI(slug2)}</loc>
    <lastmod>${content.date?.toISOString()}</lastmod>
  </url>`,"createURLEntry");return`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Array.from(idx).map(([slug2,content])=>createURLEntry(simplifySlug(slug2),content)).join("")}</urlset>`}__name(generateSiteMap,"generateSiteMap");function generateRSSFeed(cfg,idx){let root=`https://${cfg.baseUrl??""}`,createURLEntry=__name((slug2,content)=>`<item>
    <title>${escapeHTML(content.title)}</title>
    <link>${root}/${encodeURI(slug2)}</link>
    <guid>${root}/${encodeURI(slug2)}</guid>
    <description>${content.description}</description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`,"createURLEntry"),items=Array.from(idx).map(([slug2,content])=>createURLEntry(simplifySlug(slug2),content)).join("");return`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>${root}</link>
      <description>Recent content on ${cfg.pageTitle}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`}__name(generateRSSFeed,"generateRSSFeed");var ContentIndex=__name(opts=>(opts={...defaultOptions10,...opts},{name:"ContentIndex",async emit(ctx,content,_resources,emit){let cfg=ctx.cfg.configuration,emitted=[],linkIndex=new Map;for(let[_tree,file]of content){let slug2=file.data.slug,date=getDate(ctx.cfg.configuration,file.data)??new Date;(opts?.includeEmptyFiles||file.data.text&&file.data.text!=="")&&linkIndex.set(slug2,{title:file.data.frontmatter?.title,links:file.data.links??[],tags:file.data.frontmatter?.tags??[],content:file.data.text??"",date,description:file.data.description??""})}opts?.enableSiteMap&&emitted.push(await emit({content:generateSiteMap(cfg,linkIndex),slug:"sitemap",ext:".xml"})),opts?.enableRSS&&emitted.push(await emit({content:generateRSSFeed(cfg,linkIndex),slug:"index",ext:".xml"}));let fp=path7.join("static","contentIndex"),simplifiedIndex=Object.fromEntries(Array.from(linkIndex).map(([slug2,content2])=>(delete content2.description,delete content2.date,[slug2,content2])));return emitted.push(await emit({content:JSON.stringify(simplifiedIndex),slug:fp,ext:".json"})),emitted},getQuartzComponents:()=>[]}),"ContentIndex");import path8 from"path";var AliasRedirects=__name(()=>({name:"AliasRedirects",getQuartzComponents(){return[]},async emit({argv},content,_resources,emit){let fps=[];for(let[_tree,file]of content){let ogSlug=simplifySlug(file.data.slug),dir=path8.posix.relative(argv.directory,path8.dirname(file.data.filePath)),aliases=file.data.frontmatter?.aliases??file.data.frontmatter?.alias??[];typeof aliases=="string"&&(aliases=[aliases]);let slugs=aliases.map(alias=>path8.posix.join(dir,alias)),permalink=file.data.frontmatter?.permalink;typeof permalink=="string"&&slugs.push(permalink);for(let slug2 of slugs){let redirUrl=resolveRelative(slug2,file.data.slug),fp=await emit({content:`
            <!DOCTYPE html>
            <html lang="en-us">
            <head>
            <title>${ogSlug}</title>
            <link rel="canonical" href="${redirUrl}">
            <meta name="robots" content="noindex">
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0; url=${redirUrl}">
            </head>
            </html>
            `,slug:slug2,ext:".html"});fps.push(fp)}}return fps}}),"AliasRedirects");import path10 from"path";import fs2 from"fs";import path9 from"path";import{globby}from"globby";function toPosixPath(fp){return fp.split(path9.sep).join("/")}__name(toPosixPath,"toPosixPath");async function glob(pattern,cwd,ignorePatterns){return(await globby(pattern,{cwd,ignore:ignorePatterns,gitignore:!0})).map(toPosixPath)}__name(glob,"glob");var Assets=__name(()=>({name:"Assets",getQuartzComponents(){return[]},async emit({argv,cfg},_content,_resources,_emit){let assetsPath=argv.output,fps=await glob("**",argv.directory,["**/*.md",...cfg.configuration.ignorePatterns]),res=[];for(let fp of fps){let ext=path10.extname(fp),src=joinSegments(argv.directory,fp),name=slugifyFilePath(fp,!0)+ext,dest=joinSegments(assetsPath,name),dir=path10.dirname(dest);await fs2.promises.mkdir(dir,{recursive:!0}),await fs2.promises.copyFile(src,dest),res.push(dest)}return res}}),"Assets");import fs3 from"fs";var Static=__name(()=>({name:"Static",getQuartzComponents(){return[]},async emit({argv,cfg},_content,_resources,_emit){let staticPath=joinSegments(QUARTZ,"static"),fps=await glob("**",staticPath,cfg.configuration.ignorePatterns);return await fs3.promises.cp(staticPath,joinSegments(argv.output,"static"),{recursive:!0}),fps.map(fp=>joinSegments(argv.output,"static",fp))}}),"Static");var spa_inline_default=`// node_modules/micromorph/dist/index.js
var T = (e) => (t, r) => t[\`node\${e}\`] === r[\`node\${e}\`];
var b = T("Name");
var C = T("Type");
var g = T("Value");
function M(e, t) {
  if (e.attributes.length === 0 && t.attributes.length === 0)
    return [];
  let r = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  for (let s of e.attributes)
    n.set(s.name, s.value);
  for (let s of t.attributes) {
    let a = n.get(s.name);
    s.value === a ? n.delete(s.name) : (typeof a < "u" && n.delete(s.name), o.set(s.name, s.value));
  }
  for (let s of n.keys())
    r.push({ type: 5, name: s });
  for (let [s, a] of o.entries())
    r.push({ type: 4, name: s, value: a });
  return r;
}
function N(e, t = true) {
  let r = \`\${e.localName}\`;
  for (let { name: n, value: o } of e.attributes)
    t && n.startsWith("data-") || (r += \`[\${n}=\${o}]\`);
  return r += e.innerHTML, r;
}
function h(e) {
  switch (e.tagName) {
    case "BASE":
    case "TITLE":
      return e.localName;
    case "META": {
      if (e.hasAttribute("name"))
        return \`meta[name="\${e.getAttribute("name")}"]\`;
      if (e.hasAttribute("property"))
        return \`meta[name="\${e.getAttribute("property")}"]\`;
      break;
    }
    case "LINK": {
      if (e.hasAttribute("rel") && e.hasAttribute("href"))
        return \`link[rel="\${e.getAttribute("rel")}"][href="\${e.getAttribute("href")}"]\`;
      if (e.hasAttribute("href"))
        return \`link[href="\${e.getAttribute("href")}"]\`;
      break;
    }
  }
  return N(e);
}
function x(e) {
  let [t, r = ""] = e.split("?");
  return \`\${t}?t=\${Date.now()}&\${r.replace(/t=\\d+/g, "")}\`;
}
function c(e) {
  if (e.nodeType === 1 && e.hasAttribute("data-persist"))
    return e;
  if (e.nodeType === 1 && e.localName === "script") {
    let t = document.createElement("script");
    for (let { name: r, value: n } of e.attributes)
      r === "src" && (n = x(n)), t.setAttribute(r, n);
    return t.innerHTML = e.innerHTML, t;
  }
  return e.cloneNode(true);
}
function R(e, t) {
  if (e.children.length === 0 && t.children.length === 0)
    return [];
  let r = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let a of e.children)
    n.set(h(a), a);
  for (let a of t.children) {
    let i = h(a), u = n.get(i);
    u ? N(a, false) !== N(u, false) && o.set(i, c(a)) : s.set(i, c(a)), n.delete(i);
  }
  for (let a of e.childNodes) {
    if (a.nodeType === 1) {
      let i = h(a);
      if (n.has(i)) {
        r.push({ type: 1 });
        continue;
      } else if (o.has(i)) {
        let u = o.get(i);
        r.push({ type: 3, attributes: M(a, u), children: I(a, u) });
        continue;
      }
    }
    r.push(void 0);
  }
  for (let a of s.values())
    r.push({ type: 0, node: c(a) });
  return r;
}
function I(e, t) {
  let r = [], n = Math.max(e.childNodes.length, t.childNodes.length);
  for (let o = 0; o < n; o++) {
    let s = e.childNodes.item(o), a = t.childNodes.item(o);
    r[o] = p(s, a);
  }
  return r;
}
function p(e, t) {
  if (!e)
    return { type: 0, node: c(t) };
  if (!t)
    return { type: 1 };
  if (C(e, t)) {
    if (e.nodeType === 3) {
      let r = e.nodeValue, n = t.nodeValue;
      if (r.trim().length === 0 && n.trim().length === 0)
        return;
    }
    if (e.nodeType === 1) {
      if (b(e, t)) {
        let r = e.tagName === "HEAD" ? R : I;
        return { type: 3, attributes: M(e, t), children: r(e, t) };
      }
      return { type: 2, node: c(t) };
    } else
      return e.nodeType === 9 ? p(e.documentElement, t.documentElement) : g(e, t) ? void 0 : { type: 2, value: t.nodeValue };
  }
  return { type: 2, node: c(t) };
}
function $(e, t) {
  if (t.length !== 0)
    for (let { type: r, name: n, value: o } of t)
      r === 5 ? e.removeAttribute(n) : r === 4 && e.setAttribute(n, o);
}
async function O(e, t, r) {
  if (!t)
    return;
  let n;
  switch (e.nodeType === 9 ? (e = e.documentElement, n = e) : r ? n = r : n = e, t.type) {
    case 0: {
      let { node: o } = t;
      e.appendChild(o);
      return;
    }
    case 1: {
      if (!n)
        return;
      e.removeChild(n);
      return;
    }
    case 2: {
      if (!n)
        return;
      let { node: o, value: s } = t;
      if (typeof s == "string") {
        n.nodeValue = s;
        return;
      }
      n.replaceWith(o);
      return;
    }
    case 3: {
      if (!n)
        return;
      let { attributes: o, children: s } = t;
      $(n, o);
      let a = Array.from(n.childNodes);
      await Promise.all(s.map((i, u) => O(n, i, a[u])));
      return;
    }
  }
}
function P(e, t) {
  let r = p(e, t);
  return O(e, r);
}

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
function getFullSlug(window2) {
  const res = window2.document.body.dataset.slug;
  return res;
}

// quartz/components/scripts/quartz/components/scripts/spa.inline.ts
var NODE_TYPE_ELEMENT = 1;
var announcer = document.createElement("route-announcer");
var isElement = (target) => target?.nodeType === NODE_TYPE_ELEMENT;
var isLocalUrl = (href) => {
  try {
    const url = new URL(href);
    if (window.location.origin === url.origin) {
      return true;
    }
  } catch (e) {
  }
  return false;
};
var getOpts = ({ target }) => {
  if (!isElement(target))
    return;
  const a = target.closest("a");
  if (!a)
    return;
  if ("routerIgnore" in a.dataset)
    return;
  const { href } = a;
  if (!isLocalUrl(href))
    return;
  return { url: new URL(href), scroll: "routerNoscroll" in a.dataset ? false : void 0 };
};
function notifyNav(url) {
  const event = new CustomEvent("nav", { detail: { url } });
  document.dispatchEvent(event);
}
var p2;
async function navigate(url, isBack = false) {
  p2 = p2 || new DOMParser();
  const contents = await fetch(\`\${url}\`).then((res) => res.text()).catch(() => {
    window.location.assign(url);
  });
  if (!contents)
    return;
  const html = p2.parseFromString(contents, "text/html");
  let title = html.querySelector("title")?.textContent;
  if (title) {
    document.title = title;
  } else {
    const h1 = document.querySelector("h1");
    title = h1?.innerText ?? h1?.textContent ?? url.pathname;
  }
  if (announcer.textContent !== title) {
    announcer.textContent = title;
  }
  announcer.dataset.persist = "";
  html.body.appendChild(announcer);
  P(document.body, html.body);
  if (!isBack) {
    if (url.hash) {
      const el = document.getElementById(decodeURIComponent(url.hash.substring(1)));
      el?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0 });
    }
  }
  const elementsToRemove = document.head.querySelectorAll(":not([spa-preserve])");
  elementsToRemove.forEach((el) => el.remove());
  const elementsToAdd = html.head.querySelectorAll(":not([spa-preserve])");
  elementsToAdd.forEach((el) => document.head.appendChild(el));
  if (!isBack) {
    history.pushState({}, "", url);
  }
  notifyNav(getFullSlug(window));
  delete announcer.dataset.persist;
}
window.spaNavigate = navigate;
function createRouter() {
  if (typeof window !== "undefined") {
    window.addEventListener("click", async (event) => {
      const { url } = getOpts(event) ?? {};
      if (!url)
        return;
      event.preventDefault();
      try {
        navigate(url, false);
      } catch (e) {
        window.location.assign(url);
      }
    });
    window.addEventListener("popstate", (event) => {
      const { url } = getOpts(event) ?? {};
      if (window.location.hash && window.location.pathname === url?.pathname)
        return;
      try {
        navigate(new URL(window.location.toString()), true);
      } catch (e) {
        window.location.reload();
      }
      return;
    });
  }
  return new class Router {
    go(pathname) {
      const url = new URL(pathname, window.location.toString());
      return navigate(url, false);
    }
    back() {
      return window.history.back();
    }
    forward() {
      return window.history.forward();
    }
  }();
}
createRouter();
notifyNav(getFullSlug(window));
if (!customElements.get("route-announcer")) {
  const attrs = {
    "aria-live": "assertive",
    "aria-atomic": "true",
    style: "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"
  };
  customElements.define(
    "route-announcer",
    class RouteAnnouncer extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        for (const [key, value] of Object.entries(attrs)) {
          this.setAttribute(key, value);
        }
      }
    }
  );
}
`;var plausible_inline_default=`// node_modules/plausible-tracker/build/module/lib/request.js
function sendEvent(eventName, data, options) {
  const isLocalhost = /^localhost$|^127(?:\\.[0-9]+){0,2}\\.[0-9]+$|^(?:0*:)*?:?0*1$/.test(location.hostname) || location.protocol === "file:";
  if (!data.trackLocalhost && isLocalhost) {
    return console.warn("[Plausible] Ignoring event because website is running locally");
  }
  try {
    if (window.localStorage.plausible_ignore === "true") {
      return console.warn('[Plausible] Ignoring event because "plausible_ignore" is set to "true" in localStorage');
    }
  } catch (e) {
    null;
  }
  const payload = {
    n: eventName,
    u: data.url,
    d: data.domain,
    r: data.referrer,
    w: data.deviceWidth,
    h: data.hashMode ? 1 : 0,
    p: options && options.props ? JSON.stringify(options.props) : void 0
  };
  const req = new XMLHttpRequest();
  req.open("POST", \`\${data.apiHost}/api/event\`, true);
  req.setRequestHeader("Content-Type", "text/plain");
  req.send(JSON.stringify(payload));
  req.onreadystatechange = () => {
    if (req.readyState !== 4)
      return;
    if (options && options.callback) {
      options.callback();
    }
  };
}

// node_modules/plausible-tracker/build/module/lib/tracker.js
function Plausible(defaults) {
  const getConfig = () => ({
    hashMode: false,
    trackLocalhost: false,
    url: location.href,
    domain: location.hostname,
    referrer: document.referrer || null,
    deviceWidth: window.innerWidth,
    apiHost: "https://plausible.io",
    ...defaults
  });
  const trackEvent = (eventName, options, eventData) => {
    sendEvent(eventName, { ...getConfig(), ...eventData }, options);
  };
  const trackPageview2 = (eventData, options) => {
    trackEvent("pageview", options, eventData);
  };
  const enableAutoPageviews = () => {
    const page = () => trackPageview2();
    const originalPushState = history.pushState;
    if (originalPushState) {
      history.pushState = function(data, title, url) {
        originalPushState.apply(this, [data, title, url]);
        page();
      };
      addEventListener("popstate", page);
    }
    if (defaults && defaults.hashMode) {
      addEventListener("hashchange", page);
    }
    trackPageview2();
    return function cleanup() {
      if (originalPushState) {
        history.pushState = originalPushState;
        removeEventListener("popstate", page);
      }
      if (defaults && defaults.hashMode) {
        removeEventListener("hashchange", page);
      }
    };
  };
  const enableAutoOutboundTracking = (targetNode = document, observerInit = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["href"]
  }) => {
    function trackClick(event) {
      trackEvent("Outbound Link: Click", { props: { url: this.href } });
      if (!(typeof process !== "undefined" && process && false)) {
        setTimeout(() => {
          location.href = this.href;
        }, 150);
      }
      event.preventDefault();
    }
    const tracked = /* @__PURE__ */ new Set();
    function addNode(node) {
      if (node instanceof HTMLAnchorElement) {
        if (node.host !== location.host) {
          node.addEventListener("click", trackClick);
          tracked.add(node);
        }
      } else if ("querySelectorAll" in node) {
        node.querySelectorAll("a").forEach(addNode);
      }
    }
    function removeNode(node) {
      if (node instanceof HTMLAnchorElement) {
        node.removeEventListener("click", trackClick);
        tracked.delete(node);
      } else if ("querySelectorAll" in node) {
        node.querySelectorAll("a").forEach(removeNode);
      }
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          removeNode(mutation.target);
          addNode(mutation.target);
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach(addNode);
          mutation.removedNodes.forEach(removeNode);
        }
      });
    });
    targetNode.querySelectorAll("a").forEach(addNode);
    observer.observe(targetNode, observerInit);
    return function cleanup() {
      tracked.forEach((a) => {
        a.removeEventListener("click", trackClick);
      });
      tracked.clear();
      observer.disconnect();
    };
  };
  return {
    trackEvent,
    trackPageview: trackPageview2,
    enableAutoPageviews,
    enableAutoOutboundTracking
  };
}

// node_modules/plausible-tracker/build/module/index.js
var module_default = Plausible;

// quartz/components/scripts/quartz/components/scripts/plausible.inline.ts
var { trackPageview } = module_default();
document.addEventListener("nav", () => trackPageview());
`;var popover_inline_default=`// node_modules/@floating-ui/core/dist/floating-ui.core.browser.min.mjs
function t(t2) {
  return t2.split("-")[1];
}
function e(t2) {
  return "y" === t2 ? "height" : "width";
}
function n(t2) {
  return t2.split("-")[0];
}
function o(t2) {
  return ["top", "bottom"].includes(n(t2)) ? "x" : "y";
}
function i(i3, r3, a3) {
  let { reference: l3, floating: s3 } = i3;
  const c3 = l3.x + l3.width / 2 - s3.width / 2, f3 = l3.y + l3.height / 2 - s3.height / 2, m3 = o(r3), u3 = e(m3), g3 = l3[u3] / 2 - s3[u3] / 2, d3 = "x" === m3;
  let p4;
  switch (n(r3)) {
    case "top":
      p4 = { x: c3, y: l3.y - s3.height };
      break;
    case "bottom":
      p4 = { x: c3, y: l3.y + l3.height };
      break;
    case "right":
      p4 = { x: l3.x + l3.width, y: f3 };
      break;
    case "left":
      p4 = { x: l3.x - s3.width, y: f3 };
      break;
    default:
      p4 = { x: l3.x, y: l3.y };
  }
  switch (t(r3)) {
    case "start":
      p4[m3] -= g3 * (a3 && d3 ? -1 : 1);
      break;
    case "end":
      p4[m3] += g3 * (a3 && d3 ? -1 : 1);
  }
  return p4;
}
var r = async (t2, e2, n3) => {
  const { placement: o3 = "bottom", strategy: r3 = "absolute", middleware: a3 = [], platform: l3 } = n3, s3 = a3.filter(Boolean), c3 = await (null == l3.isRTL ? void 0 : l3.isRTL(e2));
  let f3 = await l3.getElementRects({ reference: t2, floating: e2, strategy: r3 }), { x: m3, y: u3 } = i(f3, o3, c3), g3 = o3, d3 = {}, p4 = 0;
  for (let n4 = 0; n4 < s3.length; n4++) {
    const { name: a4, fn: h3 } = s3[n4], { x: y2, y: x3, data: w3, reset: v3 } = await h3({ x: m3, y: u3, initialPlacement: o3, placement: g3, strategy: r3, middlewareData: d3, rects: f3, platform: l3, elements: { reference: t2, floating: e2 } });
    m3 = null != y2 ? y2 : m3, u3 = null != x3 ? x3 : u3, d3 = { ...d3, [a4]: { ...d3[a4], ...w3 } }, v3 && p4 <= 50 && (p4++, "object" == typeof v3 && (v3.placement && (g3 = v3.placement), v3.rects && (f3 = true === v3.rects ? await l3.getElementRects({ reference: t2, floating: e2, strategy: r3 }) : v3.rects), { x: m3, y: u3 } = i(f3, g3, c3)), n4 = -1);
  }
  return { x: m3, y: u3, placement: g3, strategy: r3, middlewareData: d3 };
};
function a(t2, e2) {
  return "function" == typeof t2 ? t2(e2) : t2;
}
function l(t2) {
  return "number" != typeof t2 ? function(t3) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...t3 };
  }(t2) : { top: t2, right: t2, bottom: t2, left: t2 };
}
function s(t2) {
  return { ...t2, top: t2.y, left: t2.x, right: t2.x + t2.width, bottom: t2.y + t2.height };
}
async function c(t2, e2) {
  var n3;
  void 0 === e2 && (e2 = {});
  const { x: o3, y: i3, platform: r3, rects: c3, elements: f3, strategy: m3 } = t2, { boundary: u3 = "clippingAncestors", rootBoundary: g3 = "viewport", elementContext: d3 = "floating", altBoundary: p4 = false, padding: h3 = 0 } = a(e2, t2), y2 = l(h3), x3 = f3[p4 ? "floating" === d3 ? "reference" : "floating" : d3], w3 = s(await r3.getClippingRect({ element: null == (n3 = await (null == r3.isElement ? void 0 : r3.isElement(x3))) || n3 ? x3 : x3.contextElement || await (null == r3.getDocumentElement ? void 0 : r3.getDocumentElement(f3.floating)), boundary: u3, rootBoundary: g3, strategy: m3 })), v3 = "floating" === d3 ? { ...c3.floating, x: o3, y: i3 } : c3.reference, b3 = await (null == r3.getOffsetParent ? void 0 : r3.getOffsetParent(f3.floating)), A3 = await (null == r3.isElement ? void 0 : r3.isElement(b3)) && await (null == r3.getScale ? void 0 : r3.getScale(b3)) || { x: 1, y: 1 }, R2 = s(r3.convertOffsetParentRelativeRectToViewportRelativeRect ? await r3.convertOffsetParentRelativeRectToViewportRelativeRect({ rect: v3, offsetParent: b3, strategy: m3 }) : v3);
  return { top: (w3.top - R2.top + y2.top) / A3.y, bottom: (R2.bottom - w3.bottom + y2.bottom) / A3.y, left: (w3.left - R2.left + y2.left) / A3.x, right: (R2.right - w3.right + y2.right) / A3.x };
}
var f = Math.min;
var m = Math.max;
function u(t2, e2, n3) {
  return m(t2, f(e2, n3));
}
var d = ["top", "right", "bottom", "left"];
var p = d.reduce((t2, e2) => t2.concat(e2, e2 + "-start", e2 + "-end"), []);
var h = { left: "right", right: "left", bottom: "top", top: "bottom" };
function y(t2) {
  return t2.replace(/left|right|bottom|top/g, (t3) => h[t3]);
}
function x(n3, i3, r3) {
  void 0 === r3 && (r3 = false);
  const a3 = t(n3), l3 = o(n3), s3 = e(l3);
  let c3 = "x" === l3 ? a3 === (r3 ? "end" : "start") ? "right" : "left" : "start" === a3 ? "bottom" : "top";
  return i3.reference[s3] > i3.floating[s3] && (c3 = y(c3)), { main: c3, cross: y(c3) };
}
var w = { start: "end", end: "start" };
function v(t2) {
  return t2.replace(/start|end/g, (t3) => w[t3]);
}
var A = function(e2) {
  return void 0 === e2 && (e2 = {}), { name: "flip", options: e2, async fn(o3) {
    var i3;
    const { placement: r3, middlewareData: l3, rects: s3, initialPlacement: f3, platform: m3, elements: u3 } = o3, { mainAxis: g3 = true, crossAxis: d3 = true, fallbackPlacements: p4, fallbackStrategy: h3 = "bestFit", fallbackAxisSideDirection: w3 = "none", flipAlignment: b3 = true, ...A3 } = a(e2, o3), R2 = n(r3), P2 = n(f3) === f3, E3 = await (null == m3.isRTL ? void 0 : m3.isRTL(u3.floating)), T3 = p4 || (P2 || !b3 ? [y(f3)] : function(t2) {
      const e3 = y(t2);
      return [v(t2), e3, v(e3)];
    }(f3));
    p4 || "none" === w3 || T3.push(...function(e3, o4, i4, r4) {
      const a3 = t(e3);
      let l4 = function(t2, e4, n3) {
        const o5 = ["left", "right"], i5 = ["right", "left"], r5 = ["top", "bottom"], a4 = ["bottom", "top"];
        switch (t2) {
          case "top":
          case "bottom":
            return n3 ? e4 ? i5 : o5 : e4 ? o5 : i5;
          case "left":
          case "right":
            return e4 ? r5 : a4;
          default:
            return [];
        }
      }(n(e3), "start" === i4, r4);
      return a3 && (l4 = l4.map((t2) => t2 + "-" + a3), o4 && (l4 = l4.concat(l4.map(v)))), l4;
    }(f3, b3, w3, E3));
    const D3 = [f3, ...T3], L3 = await c(o3, A3), k2 = [];
    let O3 = (null == (i3 = l3.flip) ? void 0 : i3.overflows) || [];
    if (g3 && k2.push(L3[R2]), d3) {
      const { main: t2, cross: e3 } = x(r3, s3, E3);
      k2.push(L3[t2], L3[e3]);
    }
    if (O3 = [...O3, { placement: r3, overflows: k2 }], !k2.every((t2) => t2 <= 0)) {
      var B3, C3;
      const t2 = ((null == (B3 = l3.flip) ? void 0 : B3.index) || 0) + 1, e3 = D3[t2];
      if (e3)
        return { data: { index: t2, overflows: O3 }, reset: { placement: e3 } };
      let n3 = null == (C3 = O3.filter((t3) => t3.overflows[0] <= 0).sort((t3, e4) => t3.overflows[1] - e4.overflows[1])[0]) ? void 0 : C3.placement;
      if (!n3)
        switch (h3) {
          case "bestFit": {
            var H2;
            const t3 = null == (H2 = O3.map((t4) => [t4.placement, t4.overflows.filter((t5) => t5 > 0).reduce((t5, e4) => t5 + e4, 0)]).sort((t4, e4) => t4[1] - e4[1])[0]) ? void 0 : H2[0];
            t3 && (n3 = t3);
            break;
          }
          case "initialPlacement":
            n3 = f3;
        }
      if (r3 !== n3)
        return { reset: { placement: n3 } };
    }
    return {};
  } };
};
function T(t2) {
  const e2 = f(...t2.map((t3) => t3.left)), n3 = f(...t2.map((t3) => t3.top));
  return { x: e2, y: n3, width: m(...t2.map((t3) => t3.right)) - e2, height: m(...t2.map((t3) => t3.bottom)) - n3 };
}
var D = function(t2) {
  return void 0 === t2 && (t2 = {}), { name: "inline", options: t2, async fn(e2) {
    const { placement: i3, elements: r3, rects: c3, platform: u3, strategy: g3 } = e2, { padding: d3 = 2, x: p4, y: h3 } = a(t2, e2), y2 = Array.from(await (null == u3.getClientRects ? void 0 : u3.getClientRects(r3.reference)) || []), x3 = function(t3) {
      const e3 = t3.slice().sort((t4, e4) => t4.y - e4.y), n3 = [];
      let o3 = null;
      for (let t4 = 0; t4 < e3.length; t4++) {
        const i4 = e3[t4];
        !o3 || i4.y - o3.y > o3.height / 2 ? n3.push([i4]) : n3[n3.length - 1].push(i4), o3 = i4;
      }
      return n3.map((t4) => s(T(t4)));
    }(y2), w3 = s(T(y2)), v3 = l(d3);
    const b3 = await u3.getElementRects({ reference: { getBoundingClientRect: function() {
      if (2 === x3.length && x3[0].left > x3[1].right && null != p4 && null != h3)
        return x3.find((t3) => p4 > t3.left - v3.left && p4 < t3.right + v3.right && h3 > t3.top - v3.top && h3 < t3.bottom + v3.bottom) || w3;
      if (x3.length >= 2) {
        if ("x" === o(i3)) {
          const t4 = x3[0], e4 = x3[x3.length - 1], o3 = "top" === n(i3), r5 = t4.top, a4 = e4.bottom, l4 = o3 ? t4.left : e4.left, s4 = o3 ? t4.right : e4.right;
          return { top: r5, bottom: a4, left: l4, right: s4, width: s4 - l4, height: a4 - r5, x: l4, y: r5 };
        }
        const t3 = "left" === n(i3), e3 = m(...x3.map((t4) => t4.right)), r4 = f(...x3.map((t4) => t4.left)), a3 = x3.filter((n3) => t3 ? n3.left === r4 : n3.right === e3), l3 = a3[0].top, s3 = a3[a3.length - 1].bottom;
        return { top: l3, bottom: s3, left: r4, right: e3, width: e3 - r4, height: s3 - l3, x: r4, y: l3 };
      }
      return w3;
    } }, floating: r3.floating, strategy: g3 });
    return c3.reference.x !== b3.reference.x || c3.reference.y !== b3.reference.y || c3.reference.width !== b3.reference.width || c3.reference.height !== b3.reference.height ? { reset: { rects: b3 } } : {};
  } };
};
function k(t2) {
  return "x" === t2 ? "y" : "x";
}
var O = function(t2) {
  return void 0 === t2 && (t2 = {}), { name: "shift", options: t2, async fn(e2) {
    const { x: i3, y: r3, placement: l3 } = e2, { mainAxis: s3 = true, crossAxis: f3 = false, limiter: m3 = { fn: (t3) => {
      let { x: e3, y: n3 } = t3;
      return { x: e3, y: n3 };
    } }, ...g3 } = a(t2, e2), d3 = { x: i3, y: r3 }, p4 = await c(e2, g3), h3 = o(n(l3)), y2 = k(h3);
    let x3 = d3[h3], w3 = d3[y2];
    if (s3) {
      const t3 = "y" === h3 ? "bottom" : "right";
      x3 = u(x3 + p4["y" === h3 ? "top" : "left"], x3, x3 - p4[t3]);
    }
    if (f3) {
      const t3 = "y" === y2 ? "bottom" : "right";
      w3 = u(w3 + p4["y" === y2 ? "top" : "left"], w3, w3 - p4[t3]);
    }
    const v3 = m3.fn({ ...e2, [h3]: x3, [y2]: w3 });
    return { ...v3, data: { x: v3.x - i3, y: v3.y - r3 } };
  } };
};

// node_modules/@floating-ui/dom/dist/floating-ui.dom.browser.min.mjs
function n2(t2) {
  var e2;
  return (null == (e2 = t2.ownerDocument) ? void 0 : e2.defaultView) || window;
}
function o2(t2) {
  return n2(t2).getComputedStyle(t2);
}
function i2(t2) {
  return t2 instanceof n2(t2).Node;
}
function r2(t2) {
  return i2(t2) ? (t2.nodeName || "").toLowerCase() : "#document";
}
function c2(t2) {
  return t2 instanceof n2(t2).HTMLElement;
}
function l2(t2) {
  return t2 instanceof n2(t2).Element;
}
function s2(t2) {
  return "undefined" != typeof ShadowRoot && (t2 instanceof n2(t2).ShadowRoot || t2 instanceof ShadowRoot);
}
function f2(t2) {
  const { overflow: e2, overflowX: n3, overflowY: i3, display: r3 } = o2(t2);
  return /auto|scroll|overlay|hidden|clip/.test(e2 + i3 + n3) && !["inline", "contents"].includes(r3);
}
function u2(t2) {
  return ["table", "td", "th"].includes(r2(t2));
}
function a2(t2) {
  const e2 = d2(), n3 = o2(t2);
  return "none" !== n3.transform || "none" !== n3.perspective || !!n3.containerType && "normal" !== n3.containerType || !e2 && !!n3.backdropFilter && "none" !== n3.backdropFilter || !e2 && !!n3.filter && "none" !== n3.filter || ["transform", "perspective", "filter"].some((t3) => (n3.willChange || "").includes(t3)) || ["paint", "layout", "strict", "content"].some((t3) => (n3.contain || "").includes(t3));
}
function d2() {
  return !("undefined" == typeof CSS || !CSS.supports) && CSS.supports("-webkit-backdrop-filter", "none");
}
function h2(t2) {
  return ["html", "body", "#document"].includes(r2(t2));
}
var p2 = Math.min;
var m2 = Math.max;
var g2 = Math.round;
var w2 = (t2) => ({ x: t2, y: t2 });
function x2(t2) {
  const e2 = o2(t2);
  let n3 = parseFloat(e2.width) || 0, i3 = parseFloat(e2.height) || 0;
  const r3 = c2(t2), l3 = r3 ? t2.offsetWidth : n3, s3 = r3 ? t2.offsetHeight : i3, f3 = g2(n3) !== l3 || g2(i3) !== s3;
  return f3 && (n3 = l3, i3 = s3), { width: n3, height: i3, $: f3 };
}
function v2(t2) {
  return l2(t2) ? t2 : t2.contextElement;
}
function b2(t2) {
  const e2 = v2(t2);
  if (!c2(e2))
    return w2(1);
  const n3 = e2.getBoundingClientRect(), { width: o3, height: i3, $: r3 } = x2(e2);
  let l3 = (r3 ? g2(n3.width) : n3.width) / o3, s3 = (r3 ? g2(n3.height) : n3.height) / i3;
  return l3 && Number.isFinite(l3) || (l3 = 1), s3 && Number.isFinite(s3) || (s3 = 1), { x: l3, y: s3 };
}
var L2 = w2(0);
function T2(t2, e2, o3) {
  var i3, r3;
  if (void 0 === e2 && (e2 = true), !d2())
    return L2;
  const c3 = t2 ? n2(t2) : window;
  return !o3 || e2 && o3 !== c3 ? L2 : { x: (null == (i3 = c3.visualViewport) ? void 0 : i3.offsetLeft) || 0, y: (null == (r3 = c3.visualViewport) ? void 0 : r3.offsetTop) || 0 };
}
function R(e2, o3, i3, r3) {
  void 0 === o3 && (o3 = false), void 0 === i3 && (i3 = false);
  const c3 = e2.getBoundingClientRect(), s3 = v2(e2);
  let f3 = w2(1);
  o3 && (r3 ? l2(r3) && (f3 = b2(r3)) : f3 = b2(e2));
  const u3 = T2(s3, i3, r3);
  let a3 = (c3.left + u3.x) / f3.x, d3 = (c3.top + u3.y) / f3.y, h3 = c3.width / f3.x, p4 = c3.height / f3.y;
  if (s3) {
    const t2 = n2(s3), e3 = r3 && l2(r3) ? n2(r3) : r3;
    let o4 = t2.frameElement;
    for (; o4 && r3 && e3 !== t2; ) {
      const t3 = b2(o4), e4 = o4.getBoundingClientRect(), i4 = getComputedStyle(o4), r4 = e4.left + (o4.clientLeft + parseFloat(i4.paddingLeft)) * t3.x, c4 = e4.top + (o4.clientTop + parseFloat(i4.paddingTop)) * t3.y;
      a3 *= t3.x, d3 *= t3.y, h3 *= t3.x, p4 *= t3.y, a3 += r4, d3 += c4, o4 = n2(o4).frameElement;
    }
  }
  return s({ width: h3, height: p4, x: a3, y: d3 });
}
function S(t2) {
  return ((i2(t2) ? t2.ownerDocument : t2.document) || window.document).documentElement;
}
function E2(t2) {
  return l2(t2) ? { scrollLeft: t2.scrollLeft, scrollTop: t2.scrollTop } : { scrollLeft: t2.pageXOffset, scrollTop: t2.pageYOffset };
}
function C2(t2) {
  return R(S(t2)).left + E2(t2).scrollLeft;
}
function F(t2) {
  if ("html" === r2(t2))
    return t2;
  const e2 = t2.assignedSlot || t2.parentNode || s2(t2) && t2.host || S(t2);
  return s2(e2) ? e2.host : e2;
}
function O2(t2) {
  const e2 = F(t2);
  return h2(e2) ? t2.ownerDocument ? t2.ownerDocument.body : t2.body : c2(e2) && f2(e2) ? e2 : O2(e2);
}
function D2(t2, e2) {
  var o3;
  void 0 === e2 && (e2 = []);
  const i3 = O2(t2), r3 = i3 === (null == (o3 = t2.ownerDocument) ? void 0 : o3.body), c3 = n2(i3);
  return r3 ? e2.concat(c3, c3.visualViewport || [], f2(i3) ? i3 : []) : e2.concat(i3, D2(i3));
}
function W(e2, i3, r3) {
  let s3;
  if ("viewport" === i3)
    s3 = function(t2, e3) {
      const o3 = n2(t2), i4 = S(t2), r4 = o3.visualViewport;
      let c3 = i4.clientWidth, l3 = i4.clientHeight, s4 = 0, f3 = 0;
      if (r4) {
        c3 = r4.width, l3 = r4.height;
        const t3 = d2();
        (!t3 || t3 && "fixed" === e3) && (s4 = r4.offsetLeft, f3 = r4.offsetTop);
      }
      return { width: c3, height: l3, x: s4, y: f3 };
    }(e2, r3);
  else if ("document" === i3)
    s3 = function(t2) {
      const e3 = S(t2), n3 = E2(t2), i4 = t2.ownerDocument.body, r4 = m2(e3.scrollWidth, e3.clientWidth, i4.scrollWidth, i4.clientWidth), c3 = m2(e3.scrollHeight, e3.clientHeight, i4.scrollHeight, i4.clientHeight);
      let l3 = -n3.scrollLeft + C2(t2);
      const s4 = -n3.scrollTop;
      return "rtl" === o2(i4).direction && (l3 += m2(e3.clientWidth, i4.clientWidth) - r4), { width: r4, height: c3, x: l3, y: s4 };
    }(S(e2));
  else if (l2(i3))
    s3 = function(t2, e3) {
      const n3 = R(t2, true, "fixed" === e3), o3 = n3.top + t2.clientTop, i4 = n3.left + t2.clientLeft, r4 = c2(t2) ? b2(t2) : w2(1);
      return { width: t2.clientWidth * r4.x, height: t2.clientHeight * r4.y, x: i4 * r4.x, y: o3 * r4.y };
    }(i3, r3);
  else {
    const t2 = T2(e2);
    s3 = { ...i3, x: i3.x - t2.x, y: i3.y - t2.y };
  }
  return s(s3);
}
function H(t2, e2) {
  const n3 = F(t2);
  return !(n3 === e2 || !l2(n3) || h2(n3)) && ("fixed" === o2(n3).position || H(n3, e2));
}
function z(t2, e2) {
  return c2(t2) && "fixed" !== o2(t2).position ? e2 ? e2(t2) : t2.offsetParent : null;
}
function M(t2, e2) {
  const i3 = n2(t2);
  if (!c2(t2))
    return i3;
  let l3 = z(t2, e2);
  for (; l3 && u2(l3) && "static" === o2(l3).position; )
    l3 = z(l3, e2);
  return l3 && ("html" === r2(l3) || "body" === r2(l3) && "static" === o2(l3).position && !a2(l3)) ? i3 : l3 || function(t3) {
    let e3 = F(t3);
    for (; c2(e3) && !h2(e3); ) {
      if (a2(e3))
        return e3;
      e3 = F(e3);
    }
    return null;
  }(t2) || i3;
}
function P(t2, e2, n3) {
  const o3 = c2(e2), i3 = S(e2), l3 = "fixed" === n3, s3 = R(t2, true, l3, e2);
  let u3 = { scrollLeft: 0, scrollTop: 0 };
  const a3 = w2(0);
  if (o3 || !o3 && !l3)
    if (("body" !== r2(e2) || f2(i3)) && (u3 = E2(e2)), c2(e2)) {
      const t3 = R(e2, true, l3, e2);
      a3.x = t3.x + e2.clientLeft, a3.y = t3.y + e2.clientTop;
    } else
      i3 && (a3.x = C2(i3));
  return { x: s3.left + u3.scrollLeft - a3.x, y: s3.top + u3.scrollTop - a3.y, width: s3.width, height: s3.height };
}
var A2 = { getClippingRect: function(t2) {
  let { element: e2, boundary: n3, rootBoundary: i3, strategy: c3 } = t2;
  const s3 = "clippingAncestors" === n3 ? function(t3, e3) {
    const n4 = e3.get(t3);
    if (n4)
      return n4;
    let i4 = D2(t3).filter((t4) => l2(t4) && "body" !== r2(t4)), c4 = null;
    const s4 = "fixed" === o2(t3).position;
    let u4 = s4 ? F(t3) : t3;
    for (; l2(u4) && !h2(u4); ) {
      const e4 = o2(u4), n5 = a2(u4);
      n5 || "fixed" !== e4.position || (c4 = null), (s4 ? !n5 && !c4 : !n5 && "static" === e4.position && c4 && ["absolute", "fixed"].includes(c4.position) || f2(u4) && !n5 && H(t3, u4)) ? i4 = i4.filter((t4) => t4 !== u4) : c4 = e4, u4 = F(u4);
    }
    return e3.set(t3, i4), i4;
  }(e2, this._c) : [].concat(n3), u3 = [...s3, i3], d3 = u3[0], g3 = u3.reduce((t3, n4) => {
    const o3 = W(e2, n4, c3);
    return t3.top = m2(o3.top, t3.top), t3.right = p2(o3.right, t3.right), t3.bottom = p2(o3.bottom, t3.bottom), t3.left = m2(o3.left, t3.left), t3;
  }, W(e2, d3, c3));
  return { width: g3.right - g3.left, height: g3.bottom - g3.top, x: g3.left, y: g3.top };
}, convertOffsetParentRelativeRectToViewportRelativeRect: function(t2) {
  let { rect: e2, offsetParent: n3, strategy: o3 } = t2;
  const i3 = c2(n3), l3 = S(n3);
  if (n3 === l3)
    return e2;
  let s3 = { scrollLeft: 0, scrollTop: 0 }, u3 = w2(1);
  const a3 = w2(0);
  if ((i3 || !i3 && "fixed" !== o3) && (("body" !== r2(n3) || f2(l3)) && (s3 = E2(n3)), c2(n3))) {
    const t3 = R(n3);
    u3 = b2(n3), a3.x = t3.x + n3.clientLeft, a3.y = t3.y + n3.clientTop;
  }
  return { width: e2.width * u3.x, height: e2.height * u3.y, x: e2.x * u3.x - s3.scrollLeft * u3.x + a3.x, y: e2.y * u3.y - s3.scrollTop * u3.y + a3.y };
}, isElement: l2, getDimensions: function(t2) {
  return x2(t2);
}, getOffsetParent: M, getDocumentElement: S, getScale: b2, async getElementRects(t2) {
  let { reference: e2, floating: n3, strategy: o3 } = t2;
  const i3 = this.getOffsetParent || M, r3 = this.getDimensions;
  return { reference: P(e2, await i3(n3), o3), floating: { x: 0, y: 0, ...await r3(n3) } };
}, getClientRects: (t2) => Array.from(t2.getClientRects()), isRTL: (t2) => "rtl" === o2(t2).direction };
var B2 = (t2, n3, o3) => {
  const i3 = /* @__PURE__ */ new Map(), r3 = { platform: A2, ...o3 }, c3 = { ...r3.platform, _c: i3 };
  return r(t2, n3, { ...r3, platform: c3 });
};

// quartz/components/scripts/quartz/components/scripts/popover.inline.ts
function normalizeRelativeURLs(el, base) {
  const update = (el2, attr, base2) => {
    el2.setAttribute(attr, new URL(el2.getAttribute(attr), base2).pathname);
  };
  el.querySelectorAll('[href^="./"], [href^="../"]').forEach((item) => update(item, "href", base));
  el.querySelectorAll('[src^="./"], [src^="../"]').forEach((item) => update(item, "src", base));
}
var p3 = new DOMParser();
async function mouseEnterHandler({ clientX, clientY }) {
  const link = this;
  async function setPosition(popoverElement2) {
    const { x: x3, y: y2 } = await B2(link, popoverElement2, {
      middleware: [D({ x: clientX, y: clientY }), O(), A()]
    });
    Object.assign(popoverElement2.style, {
      left: \`\${x3}px\`,
      top: \`\${y2}px\`
    });
  }
  if ([...link.children].some((child) => child.classList.contains("popover"))) {
    return setPosition(link.lastChild);
  }
  const thisUrl = new URL(document.location.href);
  thisUrl.hash = "";
  thisUrl.search = "";
  const targetUrl = new URL(link.href);
  const hash = targetUrl.hash;
  targetUrl.hash = "";
  targetUrl.search = "";
  if (thisUrl.toString() === targetUrl.toString())
    return;
  const contents = await fetch(\`\${targetUrl}\`).then((res) => res.text()).catch((err) => {
    console.error(err);
  });
  if (!contents)
    return;
  const html = p3.parseFromString(contents, "text/html");
  normalizeRelativeURLs(html, targetUrl);
  const elts = [...html.getElementsByClassName("popover-hint")];
  if (elts.length === 0)
    return;
  const popoverElement = document.createElement("div");
  popoverElement.classList.add("popover");
  const popoverInner = document.createElement("div");
  popoverInner.classList.add("popover-inner");
  popoverElement.appendChild(popoverInner);
  elts.forEach((elt) => popoverInner.appendChild(elt));
  setPosition(popoverElement);
  link.appendChild(popoverElement);
  if (hash !== "") {
    const heading = popoverInner.querySelector(hash);
    if (heading) {
      popoverInner.scroll({ top: heading.offsetTop - 12, behavior: "instant" });
    }
  }
}
document.addEventListener("nav", () => {
  const links = [...document.getElementsByClassName("internal")];
  for (const link of links) {
    link.removeEventListener("mouseenter", mouseEnterHandler);
    link.addEventListener("mouseenter", mouseEnterHandler);
  }
});
`;var base_default=`
:root {
  --shiki-color-text: #24292e;
  --shiki-color-background: #f8f8f8;
  --shiki-token-constant: #005cc5;
  --shiki-token-string: #032f62;
  --shiki-token-comment: #6a737d;
  --shiki-token-keyword: #d73a49;
  --shiki-token-parameter: #24292e;
  --shiki-token-function: #24292e;
  --shiki-token-string-expression: #22863a;
  --shiki-token-punctuation: #24292e;
  --shiki-token-link: #24292e;
}

[saved-theme=dark] {
  --shiki-color-text: #e1e4e8 !important;
  --shiki-color-background: #24292e !important;
  --shiki-token-constant: #79b8ff !important;
  --shiki-token-string: #9ecbff !important;
  --shiki-token-comment: #6a737d !important;
  --shiki-token-keyword: #f97583 !important;
  --shiki-token-parameter: #e1e4e8 !important;
  --shiki-token-function: #e1e4e8 !important;
  --shiki-token-string-expression: #85e89d !important;
  --shiki-token-punctuation: #e1e4e8 !important;
  --shiki-token-link: #e1e4e8 !important;
}

.callout {
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: 5px;
  padding: 0 1rem;
  overflow-y: hidden;
  transition: max-height 0.3s ease;
  box-sizing: border-box;
}
.callout > *:nth-child(2) {
  margin-top: 0;
}
.callout[data-callout=note] {
  --color: #448aff;
  --border: #448aff44;
  --bg: #448aff10;
}
.callout[data-callout=abstract] {
  --color: #00b0ff;
  --border: #00b0ff44;
  --bg: #00b0ff10;
}
.callout[data-callout=info], .callout[data-callout=todo] {
  --color: #00b8d4;
  --border: #00b8d444;
  --bg: #00b8d410;
}
.callout[data-callout=tip] {
  --color: #00bfa5;
  --border: #00bfa544;
  --bg: #00bfa510;
}
.callout[data-callout=success] {
  --color: #09ad7a;
  --border: #09ad7144;
  --bg: #09ad7110;
}
.callout[data-callout=question] {
  --color: #dba642;
  --border: #dba64244;
  --bg: #dba64210;
}
.callout[data-callout=warning] {
  --color: #db8942;
  --border: #db894244;
  --bg: #db894210;
}
.callout[data-callout=failure], .callout[data-callout=danger], .callout[data-callout=bug] {
  --color: #db4242;
  --border: #db424244;
  --bg: #db424210;
}
.callout[data-callout=example] {
  --color: #7a43b5;
  --border: #7a43b544;
  --bg: #7a43b510;
}
.callout[data-callout=quote] {
  --color: var(--secondary);
  --border: var(--lightgray);
}
.callout.is-collapsed > .callout-title > .fold {
  transform: rotateZ(-90deg);
}

.callout-title {
  display: flex;
  gap: 5px;
  padding: 1rem 0;
  color: var(--color);
}
.callout-title .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
  cursor: pointer;
}
.callout-title > .callout-title-inner > p {
  color: var(--color);
  margin: 0;
}

.callout-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  padding-top: 4px;
}

.callout-title-inner {
  font-weight: 700;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  overflow-x: hidden;
  width: 100vw;
}

body,
section {
  margin: 0;
  max-width: 100%;
  box-sizing: border-box;
  background-color: var(--light);
  font-family: var(--bodyFont);
  color: var(--darkgray);
}

.text-highlight {
  background-color: rgba(255, 242, 54, 0.5333333333);
  padding: 0 0.1rem;
  border-radius: 5px;
}

::selection {
  background: color-mix(in srgb, var(--tertiary) 75%, transparent);
  color: var(--darkgray);
}

p,
ul,
text,
a,
tr,
td,
li,
ol,
ul,
.katex,
.math {
  color: var(--darkgray);
  fill: var(--darkgray);
  overflow-wrap: anywhere;
  hyphens: auto;
}

.math.math-display {
  text-align: center;
}

a {
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  color: var(--secondary);
}
a:hover {
  color: var(--tertiary) !important;
}
a.internal {
  text-decoration: none;
  background-color: var(--highlight);
  padding: 0 0.1rem;
  border-radius: 5px;
}

.desktop-only {
  display: initial;
}
@media all and (max-width: 1510px) {
  .desktop-only {
    display: none;
  }
}

.mobile-only {
  display: none;
}
@media all and (max-width: 1510px) {
  .mobile-only {
    display: initial;
  }
}

@media all and (max-width: 1510px) {
  .page {
    margin: 0 auto;
    padding: 0 1rem;
    max-width: 750px;
  }
}
.page article > h1 {
  font-size: 2rem;
}
.page article li:has(> input[type=checkbox]) {
  list-style-type: none;
  padding-left: 0;
}
.page article li:has(> input[type=checkbox]:checked) {
  text-decoration: line-through;
  text-decoration-color: var(--gray);
  color: var(--gray);
}
.page article li > * {
  margin-top: 0;
  margin-bottom: 0;
}
.page article p > strong {
  color: var(--dark);
}
.page > #quartz-body {
  width: 100%;
  display: flex;
}
@media all and (max-width: 1510px) {
  .page > #quartz-body {
    flex-direction: column;
  }
}
.page > #quartz-body .sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  top: 0;
  width: 380px;
  margin-top: 6rem;
  box-sizing: border-box;
  padding: 0 4rem;
  position: fixed;
}
@media all and (max-width: 1510px) {
  .page > #quartz-body .sidebar {
    position: initial;
    flex-direction: row;
    padding: 0;
    width: initial;
    margin-top: 2rem;
  }
}
.page > #quartz-body .sidebar.left {
  left: calc((100vw - 750px) / 2 - 380px);
}
@media all and (max-width: 1510px) {
  .page > #quartz-body .sidebar.left {
    gap: 0;
    align-items: center;
  }
}
.page > #quartz-body .sidebar.right {
  right: calc((100vw - 750px) / 2 - 380px);
}
@media all and (max-width: 1510px) {
  .page > #quartz-body .sidebar.right > * {
    flex: 1;
  }
}
.page .page-header {
  width: 750px;
  margin: 6rem auto 0 auto;
}
@media all and (max-width: 1510px) {
  .page .page-header {
    width: initial;
    margin-top: 2rem;
  }
}
.page .center, .page footer {
  margin-left: auto;
  margin-right: auto;
  width: 750px;
}
@media all and (max-width: 1510px) {
  .page .center, .page footer {
    width: initial;
    margin-left: 0;
    margin-right: 0;
  }
}

.footnotes {
  margin-top: 2rem;
  border-top: 1px solid var(--lightgray);
}

input[type=checkbox] {
  transform: translateY(2px);
  color: var(--secondary);
  border: 1px solid var(--lightgray);
  border-radius: 3px;
  background-color: var(--light);
  position: relative;
  margin-inline-end: 0.2rem;
  margin-inline-start: -1.4rem;
  appearance: none;
  width: 16px;
  height: 16px;
}
input[type=checkbox]:checked {
  border-color: var(--secondary);
  background-color: var(--secondary);
}
input[type=checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  display: block;
  border: solid var(--light);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

blockquote {
  margin: 1rem 0;
  border-left: 3px solid var(--secondary);
  padding-left: 1rem;
  transition: border-color 0.2s ease;
}

h1,
h2,
h3,
h4,
h5,
h6,
thead {
  font-family: var(--headerFont);
  color: var(--dark);
  font-weight: revert;
  margin-bottom: 0;
}
article > h1 > a,
article > h2 > a,
article > h3 > a,
article > h4 > a,
article > h5 > a,
article > h6 > a,
article > thead > a {
  color: var(--dark);
}
article > h1 > a.internal,
article > h2 > a.internal,
article > h3 > a.internal,
article > h4 > a.internal,
article > h5 > a.internal,
article > h6 > a.internal,
article > thead > a.internal {
  background-color: transparent;
}

h1[id] > a[href^="#"],
h2[id] > a[href^="#"],
h3[id] > a[href^="#"],
h4[id] > a[href^="#"],
h5[id] > a[href^="#"],
h6[id] > a[href^="#"] {
  margin: 0 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translateY(-0.1rem);
  display: inline-block;
  font-family: var(--codeFont);
  user-select: none;
}
h1[id]:hover > a,
h2[id]:hover > a,
h3[id]:hover > a,
h4[id]:hover > a,
h5[id]:hover > a,
h6[id]:hover > a {
  opacity: 1;
}

h1 {
  font-size: 1.75rem;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.4rem;
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.12rem;
  margin-top: 1.62rem;
  margin-bottom: 1rem;
}

h4,
h5,
h6 {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

div[data-rehype-pretty-code-fragment] {
  line-height: 1.6rem;
  position: relative;
}
div[data-rehype-pretty-code-fragment] > div[data-rehype-pretty-code-title] {
  font-family: var(--codeFont);
  font-size: 0.9rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--lightgray);
  width: max-content;
  border-radius: 5px;
  margin-bottom: -0.5rem;
  color: var(--darkgray);
}
div[data-rehype-pretty-code-fragment] > pre {
  padding: 0.5rem 0;
}

pre {
  font-family: var(--codeFont);
  padding: 0.5rem;
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--lightgray);
}
pre:has(> code.mermaid) {
  border: none;
}
pre > code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  counter-reset: line;
  counter-increment: line 0;
  display: grid;
}
pre > code [data-highlighted-chars] {
  background-color: var(--highlight);
  border-radius: 5px;
}
pre > code > [data-line] {
  padding: 0 0.25rem;
  box-sizing: border-box;
  border-left: 3px solid transparent;
}
pre > code > [data-line][data-highlighted-line] {
  background-color: var(--highlight);
  border-left: 3px solid var(--secondary);
}
pre > code > [data-line]::before {
  content: counter(line);
  counter-increment: line;
  width: 1rem;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(115, 138, 148, 0.6);
}
pre > code[data-line-numbers-max-digits="2"] > [data-line]::before {
  width: 2rem;
}
pre > code[data-line-numbers-max-digits="3"] > [data-line]::before {
  width: 3rem;
}

code {
  font-size: 0.9em;
  color: var(--dark);
  font-family: var(--codeFont);
  border-radius: 5px;
  padding: 0.1rem 0.2rem;
  background: var(--lightgray);
}

tbody,
li,
p {
  line-height: 1.6rem;
}

table {
  margin: 1rem;
  padding: 1.5rem;
  border-collapse: collapse;
}
table > * {
  line-height: 2rem;
}

th {
  text-align: left;
  padding: 0.4rem 1rem;
  border-bottom: 2px solid var(--gray);
}

td {
  padding: 0.2rem 1rem;
}

tr {
  border-bottom: 1px solid var(--lightgray);
}
tr:last-child {
  border-bottom: none;
}

img {
  max-width: 100%;
  border-radius: 5px;
  margin: 1rem 0;
}

p > img + em {
  display: block;
  transform: translateY(-1rem);
}

hr {
  width: 100%;
  margin: 2rem auto;
  height: 1px;
  border: none;
  background-color: var(--lightgray);
}

audio,
video {
  width: 100%;
  border-radius: 5px;
}

.spacer {
  flex: 1 1 auto;
}

ul.overflow,
ol.overflow {
  height: 300px;
  overflow-y: auto;
  content: "";
  clear: both;
}
ul.overflow > li:last-of-type,
ol.overflow > li:last-of-type {
  margin-bottom: 50px;
}
ul.overflow:after,
ol.overflow:after {
  pointer-events: none;
  content: "";
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 1;
  transition: opacity 0.3s ease;
  background: linear-gradient(transparent 0px, var(--light));
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9zdHlsZXMiLCJzb3VyY2VzIjpbInN5bnRheC5zY3NzIiwiY2FsbG91dHMuc2NzcyIsImJhc2Uuc2NzcyIsInZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUN6QkY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBRUU7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBR0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFOzs7QUN4R0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBV0U7RUFDQTtFQUNBO0VBQ0E7OztBQUlBO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFJSjtFQUNFOztBQUNBO0VBRkY7SUFHSTs7OztBQUlKO0VBQ0U7O0FBQ0E7RUFGRjtJQUdJOzs7O0FBS0Y7RUFERjtJQUVJO0lBQ0E7SUFDQSxXQzdGUTs7O0FEaUdSO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOztBQUlKO0VBQ0U7RUFDQTs7QUFDQTtFQUhGO0lBSUk7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE9DcElXO0VEcUlYLFlDcElPO0VEcUlQO0VBQ0E7RUFDQTs7QUFDQTtFQVhGO0lBWUk7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7O0FBSUo7RUFDRTs7QUFDQTtFQUZGO0lBR0k7SUFDQTs7O0FBSUo7RUFDRTs7QUFFRTtFQURGO0lBRUk7OztBQU1SO0VBQ0UsT0N4S1E7RUR5S1I7O0FBQ0E7RUFIRjtJQUlJO0lBQ0E7OztBQUlKO0VBRUU7RUFDQTtFQUNBLE9DcExROztBRHFMUjtFQUxGO0lBTUk7SUFDQTtJQUNBOzs7O0FBS047RUFDRTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUtOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBT0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFOzs7QUFXSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0VBR0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFJSjtFQUNFOztBQUdGO0VBQ0U7OztBQUtOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7RUFHRTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBQ0E7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7O0FBQ0E7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBR0Y7QUFBQTtFQUVFO0VBQ0E7RUFHQTtFQUNBOztBQUVBO0FBQUE7RUFDRTs7QUFHRjtBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBucHggY29udmVydC1zaC10aGVtZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc2hpa2lqcy9zaGlraS9tYWluL3BhY2thZ2VzL3NoaWtpL3RoZW1lcy9naXRodWItbGlnaHQuanNvblxuOnJvb3Qge1xuICAtLXNoaWtpLWNvbG9yLXRleHQ6ICMyNDI5MmU7XG4gIC0tc2hpa2ktY29sb3ItYmFja2dyb3VuZDogI2Y4ZjhmODtcbiAgLS1zaGlraS10b2tlbi1jb25zdGFudDogIzAwNWNjNTtcbiAgLS1zaGlraS10b2tlbi1zdHJpbmc6ICMwMzJmNjI7XG4gIC0tc2hpa2ktdG9rZW4tY29tbWVudDogIzZhNzM3ZDtcbiAgLS1zaGlraS10b2tlbi1rZXl3b3JkOiAjZDczYTQ5O1xuICAtLXNoaWtpLXRva2VuLXBhcmFtZXRlcjogIzI0MjkyZTtcbiAgLS1zaGlraS10b2tlbi1mdW5jdGlvbjogIzI0MjkyZTtcbiAgLS1zaGlraS10b2tlbi1zdHJpbmctZXhwcmVzc2lvbjogIzIyODYzYTtcbiAgLS1zaGlraS10b2tlbi1wdW5jdHVhdGlvbjogIzI0MjkyZTtcbiAgLS1zaGlraS10b2tlbi1saW5rOiAjMjQyOTJlO1xufVxuXG4vLyBucHggY29udmVydC1zaC10aGVtZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc2hpa2lqcy9zaGlraS9tYWluL3BhY2thZ2VzL3NoaWtpL3RoZW1lcy9naXRodWItZGFyay5qc29uXG5bc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIHtcbiAgLS1zaGlraS1jb2xvci10ZXh0OiAjZTFlNGU4ICFpbXBvcnRhbnQ7XG4gIC0tc2hpa2ktY29sb3ItYmFja2dyb3VuZDogIzI0MjkyZSAhaW1wb3J0YW50O1xuICAtLXNoaWtpLXRva2VuLWNvbnN0YW50OiAjNzliOGZmICFpbXBvcnRhbnQ7XG4gIC0tc2hpa2ktdG9rZW4tc3RyaW5nOiAjOWVjYmZmICFpbXBvcnRhbnQ7XG4gIC0tc2hpa2ktdG9rZW4tY29tbWVudDogIzZhNzM3ZCAhaW1wb3J0YW50O1xuICAtLXNoaWtpLXRva2VuLWtleXdvcmQ6ICNmOTc1ODMgIWltcG9ydGFudDtcbiAgLS1zaGlraS10b2tlbi1wYXJhbWV0ZXI6ICNlMWU0ZTggIWltcG9ydGFudDtcbiAgLS1zaGlraS10b2tlbi1mdW5jdGlvbjogI2UxZTRlOCAhaW1wb3J0YW50O1xuICAtLXNoaWtpLXRva2VuLXN0cmluZy1leHByZXNzaW9uOiAjODVlODlkICFpbXBvcnRhbnQ7XG4gIC0tc2hpa2ktdG9rZW4tcHVuY3R1YXRpb246ICNlMWU0ZTggIWltcG9ydGFudDtcbiAgLS1zaGlraS10b2tlbi1saW5rOiAjZTFlNGU4ICFpbXBvcnRhbnQ7XG59XG4iLCJAdXNlIFwic2Fzczpjb2xvclwiO1xuXG4uY2FsbG91dCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnKTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBwYWRkaW5nOiAwIDFyZW07XG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAwLjNzIGVhc2U7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgJiA+ICo6bnRoLWNoaWxkKDIpIHtcbiAgICBtYXJnaW4tdG9wOiAwO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJub3RlXCJdIHtcbiAgICAtLWNvbG9yOiAjNDQ4YWZmO1xuICAgIC0tYm9yZGVyOiAjNDQ4YWZmNDQ7XG4gICAgLS1iZzogIzQ0OGFmZjEwO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJhYnN0cmFjdFwiXSB7XG4gICAgLS1jb2xvcjogIzAwYjBmZjtcbiAgICAtLWJvcmRlcjogIzAwYjBmZjQ0O1xuICAgIC0tYmc6ICMwMGIwZmYxMDtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiaW5mb1wiXSxcbiAgJltkYXRhLWNhbGxvdXQ9XCJ0b2RvXCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiOGQ0O1xuICAgIC0tYm9yZGVyOiAjMDBiOGQ0NDQ7XG4gICAgLS1iZzogIzAwYjhkNDEwO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJ0aXBcIl0ge1xuICAgIC0tY29sb3I6ICMwMGJmYTU7XG4gICAgLS1ib3JkZXI6ICMwMGJmYTU0NDtcbiAgICAtLWJnOiAjMDBiZmE1MTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInN1Y2Nlc3NcIl0ge1xuICAgIC0tY29sb3I6ICMwOWFkN2E7XG4gICAgLS1ib3JkZXI6ICMwOWFkNzE0NDtcbiAgICAtLWJnOiAjMDlhZDcxMTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInF1ZXN0aW9uXCJdIHtcbiAgICAtLWNvbG9yOiAjZGJhNjQyO1xuICAgIC0tYm9yZGVyOiAjZGJhNjQyNDQ7XG4gICAgLS1iZzogI2RiYTY0MjEwO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJ3YXJuaW5nXCJdIHtcbiAgICAtLWNvbG9yOiAjZGI4OTQyO1xuICAgIC0tYm9yZGVyOiAjZGI4OTQyNDQ7XG4gICAgLS1iZzogI2RiODk0MjEwO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJmYWlsdXJlXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cImRhbmdlclwiXSxcbiAgJltkYXRhLWNhbGxvdXQ9XCJidWdcIl0ge1xuICAgIC0tY29sb3I6ICNkYjQyNDI7XG4gICAgLS1ib3JkZXI6ICNkYjQyNDI0NDtcbiAgICAtLWJnOiAjZGI0MjQyMTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImV4YW1wbGVcIl0ge1xuICAgIC0tY29sb3I6ICM3YTQzYjU7XG4gICAgLS1ib3JkZXI6ICM3YTQzYjU0NDtcbiAgICAtLWJnOiAjN2E0M2I1MTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInF1b3RlXCJdIHtcbiAgICAtLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgIC0tYm9yZGVyOiB2YXIoLS1saWdodGdyYXkpO1xuICB9XG5cbiAgJi5pcy1jb2xsYXBzZWQgPiAuY2FsbG91dC10aXRsZSA+IC5mb2xkIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVooLTkwZGVnKTtcbiAgfVxufVxuXG4uY2FsbG91dC10aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogNXB4O1xuICBwYWRkaW5nOiAxcmVtIDA7XG4gIGNvbG9yOiB2YXIoLS1jb2xvcik7XG5cbiAgJiAuZm9sZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgIG9wYWNpdHk6IDAuODtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cblxuICAmID4gLmNhbGxvdXQtdGl0bGUtaW5uZXIgPiBwIHtcbiAgICBjb2xvcjogdmFyKC0tY29sb3IpO1xuICAgIG1hcmdpbjogMDtcbiAgfVxufVxuXG4uY2FsbG91dC1pY29uIHtcbiAgd2lkdGg6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgZmxleDogMCAwIDE4cHg7XG4gIHBhZGRpbmctdG9wOiA0cHg7XG59XG5cbi5jYWxsb3V0LXRpdGxlLWlubmVyIHtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cbiIsIkB1c2UgXCIuL2N1c3RvbS5zY3NzXCI7XG5AdXNlIFwiLi9zeW50YXguc2Nzc1wiO1xuQHVzZSBcIi4vY2FsbG91dHMuc2Nzc1wiO1xuQHVzZSBcIi4vdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG5odG1sIHtcbiAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcbiAgdGV4dC1zaXplLWFkanVzdDogbm9uZTtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICB3aWR0aDogMTAwdnc7XG59XG5cbmJvZHksXG5zZWN0aW9uIHtcbiAgbWFyZ2luOiAwO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgY29sb3I6IHZhcigtLWRhcmtncmF5KTtcbn1cblxuLnRleHQtaGlnaGxpZ2h0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjIzNjg4O1xuICBwYWRkaW5nOiAwIDAuMXJlbTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xufVxuXG46OnNlbGVjdGlvbiB7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS10ZXJ0aWFyeSkgNzUlLCB0cmFuc3BhcmVudCk7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG59XG5cbnAsXG51bCxcbnRleHQsXG5hLFxudHIsXG50ZCxcbmxpLFxub2wsXG51bCxcbi5rYXRleCxcbi5tYXRoIHtcbiAgY29sb3I6IHZhcigtLWRhcmtncmF5KTtcbiAgZmlsbDogdmFyKC0tZGFya2dyYXkpO1xuICBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTtcbiAgaHlwaGVuczogYXV0bztcbn1cblxuLm1hdGgge1xuICAmLm1hdGgtZGlzcGxheSB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG59XG5cbmEge1xuICBmb250LXdlaWdodDogNjAwO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgZWFzZTtcbiAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG5cbiAgJjpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLXRlcnRpYXJ5KSAhaW1wb3J0YW50O1xuICB9XG5cbiAgJi5pbnRlcm5hbCB7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgcGFkZGluZzogMCAwLjFyZW07XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICB9XG59XG5cbi5kZXNrdG9wLW9ubHkge1xuICBkaXNwbGF5OiBpbml0aWFsO1xuICBAbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAkZnVsbFBhZ2VXaWR0aCkge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cblxuLm1vYmlsZS1vbmx5IHtcbiAgZGlzcGxheTogbm9uZTtcbiAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICBkaXNwbGF5OiBpbml0aWFsO1xuICB9XG59XG5cbi5wYWdlIHtcbiAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICBwYWRkaW5nOiAwIDFyZW07XG4gICAgbWF4LXdpZHRoOiAkcGFnZVdpZHRoO1xuICB9XG5cbiAgJiBhcnRpY2xlIHtcbiAgICAmID4gaDEge1xuICAgICAgZm9udC1zaXplOiAycmVtO1xuICAgIH1cblxuICAgICYgbGk6aGFzKD4gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdKSB7XG4gICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgfVxuXG4gICAgJiBsaTpoYXMoPiBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCkge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBsaW5lLXRocm91Z2g7XG4gICAgICB0ZXh0LWRlY29yYXRpb24tY29sb3I6IHZhcigtLWdyYXkpO1xuICAgICAgY29sb3I6IHZhcigtLWdyYXkpO1xuICAgIH1cblxuICAgICYgbGkgPiAqIHtcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIHAgPiBzdHJvbmcge1xuICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIH1cbiAgfVxuXG4gICYgPiAjcXVhcnR6LWJvZHkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgfVxuXG4gICAgJiAuc2lkZWJhciB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBnYXA6IDJyZW07XG4gICAgICB0b3A6IDA7XG4gICAgICB3aWR0aDogJHNpZGVQYW5lbFdpZHRoO1xuICAgICAgbWFyZ2luLXRvcDogJHRvcFNwYWNpbmc7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgcGFkZGluZzogMCA0cmVtO1xuICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICAgICAgcG9zaXRpb246IGluaXRpYWw7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIHdpZHRoOiBpbml0aWFsO1xuICAgICAgICBtYXJnaW4tdG9wOiAycmVtO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgLnNpZGViYXIubGVmdCB7XG4gICAgICBsZWZ0OiBjYWxjKGNhbGMoMTAwdncgLSAkcGFnZVdpZHRoKSAvIDIgLSAkc2lkZVBhbmVsV2lkdGgpO1xuICAgICAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICAgICAgZ2FwOiAwO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgLnNpZGViYXIucmlnaHQge1xuICAgICAgcmlnaHQ6IGNhbGMoY2FsYygxMDB2dyAtICRwYWdlV2lkdGgpIC8gMiAtICRzaWRlUGFuZWxXaWR0aCk7XG4gICAgICAmID4gKiB7XG4gICAgICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICAgICAgZmxleDogMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICYgLnBhZ2UtaGVhZGVyIHtcbiAgICB3aWR0aDogJHBhZ2VXaWR0aDtcbiAgICBtYXJnaW46ICR0b3BTcGFjaW5nIGF1dG8gMCBhdXRvO1xuICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICB3aWR0aDogaW5pdGlhbDtcbiAgICAgIG1hcmdpbi10b3A6IDJyZW07XG4gICAgfVxuICB9XG5cbiAgJiAuY2VudGVyLFxuICAmIGZvb3RlciB7XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICAgIHdpZHRoOiAkcGFnZVdpZHRoO1xuICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICB3aWR0aDogaW5pdGlhbDtcbiAgICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgIH1cbiAgfVxufVxuXG4uZm9vdG5vdGVzIHtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG59XG5cbmlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgycHgpO1xuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLWlubGluZS1lbmQ6IDAuMnJlbTtcbiAgbWFyZ2luLWlubGluZS1zdGFydDogLTEuNHJlbTtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMTZweDtcblxuICAmOmNoZWNrZWQge1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICAgJjo6YWZ0ZXIge1xuICAgICAgY29udGVudDogXCJcIjtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDRweDtcbiAgICAgIHRvcDogMXB4O1xuICAgICAgd2lkdGg6IDRweDtcbiAgICAgIGhlaWdodDogOHB4O1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBib3JkZXI6IHNvbGlkIHZhcigtLWxpZ2h0KTtcbiAgICAgIGJvcmRlci13aWR0aDogMCAycHggMnB4IDA7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XG4gICAgfVxuICB9XG59XG5cbmJsb2NrcXVvdGUge1xuICBtYXJnaW46IDFyZW0gMDtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xuICBwYWRkaW5nLWxlZnQ6IDFyZW07XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzIGVhc2U7XG59XG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnRoZWFkIHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWhlYWRlckZvbnQpO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGZvbnQtd2VpZ2h0OiByZXZlcnQ7XG4gIG1hcmdpbi1ib3R0b206IDA7XG5cbiAgYXJ0aWNsZSA+ICYgPiBhIHtcbiAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgJi5pbnRlcm5hbCB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICB9XG4gIH1cbn1cblxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2IHtcbiAgJltpZF0gPiBhW2hyZWZePVwiI1wiXSB7XG4gICAgbWFyZ2luOiAwIDAuNXJlbTtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycyBlYXNlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMC4xcmVtKTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuXG4gICZbaWRdOmhvdmVyID4gYSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuXG4vLyB0eXBvZ3JhcGh5IGltcHJvdmVtZW50c1xuaDEge1xuICBmb250LXNpemU6IDEuNzVyZW07XG4gIG1hcmdpbi10b3A6IDIuMjVyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmgyIHtcbiAgZm9udC1zaXplOiAxLjRyZW07XG4gIG1hcmdpbi10b3A6IDEuOXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuaDMge1xuICBmb250LXNpemU6IDEuMTJyZW07XG4gIG1hcmdpbi10b3A6IDEuNjJyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmg0LFxuaDUsXG5oNiB7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5kaXZbZGF0YS1yZWh5cGUtcHJldHR5LWNvZGUtZnJhZ21lbnRdIHtcbiAgbGluZS1oZWlnaHQ6IDEuNnJlbTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICYgPiBkaXZbZGF0YS1yZWh5cGUtcHJldHR5LWNvZGUtdGl0bGVdIHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tY29kZUZvbnQpO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgIHBhZGRpbmc6IDAuMXJlbSAwLjVyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICB3aWR0aDogbWF4LWNvbnRlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIG1hcmdpbi1ib3R0b206IC0wLjVyZW07XG4gICAgY29sb3I6IHZhcigtLWRhcmtncmF5KTtcbiAgfVxuXG4gICYgPiBwcmUge1xuICAgIHBhZGRpbmc6IDAuNXJlbSAwO1xuICB9XG59XG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gIHBhZGRpbmc6IDAuNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuXG4gICY6aGFzKD4gY29kZS5tZXJtYWlkKSB7XG4gICAgYm9yZGVyOiBub25lO1xuICB9XG5cbiAgJiA+IGNvZGUge1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgY291bnRlci1yZXNldDogbGluZTtcbiAgICBjb3VudGVyLWluY3JlbWVudDogbGluZSAwO1xuICAgIGRpc3BsYXk6IGdyaWQ7XG5cbiAgICAmIFtkYXRhLWhpZ2hsaWdodGVkLWNoYXJzXSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oaWdobGlnaHQpO1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIH1cblxuICAgICYgPiBbZGF0YS1saW5lXSB7XG4gICAgICBwYWRkaW5nOiAwIDAuMjVyZW07XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB0cmFuc3BhcmVudDtcblxuICAgICAgJltkYXRhLWhpZ2hsaWdodGVkLWxpbmVdIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGlnaGxpZ2h0KTtcbiAgICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xuICAgICAgfVxuXG4gICAgICAmOjpiZWZvcmUge1xuICAgICAgICBjb250ZW50OiBjb3VudGVyKGxpbmUpO1xuICAgICAgICBjb3VudGVyLWluY3JlbWVudDogbGluZTtcbiAgICAgICAgd2lkdGg6IDFyZW07XG4gICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgY29sb3I6IHJnYmEoMTE1LCAxMzgsIDE0OCwgMC42KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmW2RhdGEtbGluZS1udW1iZXJzLW1heC1kaWdpdHM9XCIyXCJdID4gW2RhdGEtbGluZV06OmJlZm9yZSB7XG4gICAgICB3aWR0aDogMnJlbTtcbiAgICB9XG5cbiAgICAmW2RhdGEtbGluZS1udW1iZXJzLW1heC1kaWdpdHM9XCIzXCJdID4gW2RhdGEtbGluZV06OmJlZm9yZSB7XG4gICAgICB3aWR0aDogM3JlbTtcbiAgICB9XG4gIH1cbn1cblxuY29kZSB7XG4gIGZvbnQtc2l6ZTogMC45ZW07XG4gIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBwYWRkaW5nOiAwLjFyZW0gMC4ycmVtO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodGdyYXkpO1xufVxuXG50Ym9keSxcbmxpLFxucCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjZyZW07XG59XG5cbnRhYmxlIHtcbiAgbWFyZ2luOiAxcmVtO1xuICBwYWRkaW5nOiAxLjVyZW07XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gICYgPiAqIHtcbiAgICBsaW5lLWhlaWdodDogMnJlbTtcbiAgfVxufVxuXG50aCB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIHBhZGRpbmc6IDAuNHJlbSAxcmVtO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgdmFyKC0tZ3JheSk7XG59XG5cbnRkIHtcbiAgcGFkZGluZzogMC4ycmVtIDFyZW07XG59XG5cbnRyIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICY6bGFzdC1jaGlsZCB7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgfVxufVxuXG5pbWcge1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgbWFyZ2luOiAxcmVtIDA7XG59XG5cbnAgPiBpbWcgKyBlbSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFyZW0pO1xufVxuXG5ociB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW46IDJyZW0gYXV0bztcbiAgaGVpZ2h0OiAxcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRncmF5KTtcbn1cblxuYXVkaW8sXG52aWRlbyB7XG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG59XG5cbi5zcGFjZXIge1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxudWwub3ZlcmZsb3csXG5vbC5vdmVyZmxvdyB7XG4gIGhlaWdodDogMzAwcHg7XG4gIG92ZXJmbG93LXk6IGF1dG87XG5cbiAgLy8gY2xlYXJmaXhcbiAgY29udGVudDogXCJcIjtcbiAgY2xlYXI6IGJvdGg7XG5cbiAgJiA+IGxpOmxhc3Qtb2YtdHlwZSB7XG4gICAgbWFyZ2luLWJvdHRvbTogNTBweDtcbiAgfVxuXG4gICY6YWZ0ZXIge1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiA1MHB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlO1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCAwcHgsIHZhcigtLWxpZ2h0KSk7XG4gIH1cbn1cbiIsIiRwYWdlV2lkdGg6IDc1MHB4O1xuJG1vYmlsZUJyZWFrcG9pbnQ6IDYwMHB4O1xuJHRhYmxldEJyZWFrcG9pbnQ6IDEyMDBweDtcbiRzaWRlUGFuZWxXaWR0aDogMzgwcHg7XG4kdG9wU3BhY2luZzogNnJlbTtcbiRmdWxsUGFnZVdpZHRoOiAkcGFnZVdpZHRoICsgMiAqICRzaWRlUGFuZWxXaWR0aDtcbiJdfQ== */`;var popover_default=`
@keyframes dropin {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
.popover {
  z-index: 999;
  position: absolute;
  overflow: visible;
  padding: 1rem;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.popover > .popover-inner {
  position: relative;
  width: 30rem;
  max-height: 20rem;
  padding: 0 1rem 1rem 1rem;
  font-weight: initial;
  line-height: normal;
  font-size: initial;
  font-family: var(--bodyFont);
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  box-shadow: 6px 6px 36px 0 rgba(0, 0, 0, 0.25);
  overflow: auto;
  white-space: normal;
}
.popover h1 {
  font-size: 1.5rem;
}
@media all and (max-width: 600px) {
  .popover {
    display: none !important;
  }
}

a:hover .popover,
.popover:hover {
  animation: dropin 0.3s ease;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL2FybWFuamluZGFsL0Rlc2t0b3AvYXJtYW5qaW5kYWwuZ2l0aHViLmlvL3F1YXJ0ei9jb21wb25lbnRzL3N0eWxlcyIsInNvdXJjZXMiOlsicG9wb3Zlci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0U7SUFDRTtJQUNBOztFQUVGO0lBQ0U7O0VBRUY7SUFDRTtJQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBdUJBO0VBQ0E7RUFDQSxZQUNFOztBQXhCRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTs7QUFTRjtFQWpDRjtJQWtDSTs7OztBQUlKO0FBQUE7RUFFRTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxuQGtleWZyYW1lcyBkcm9waW4ge1xuICAwJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIH1cbiAgMSUge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICB9XG59XG5cbi5wb3BvdmVyIHtcbiAgei1pbmRleDogOTk5O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG92ZXJmbG93OiB2aXNpYmxlO1xuICBwYWRkaW5nOiAxcmVtO1xuXG4gICYgPiAucG9wb3Zlci1pbm5lciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHdpZHRoOiAzMHJlbTtcbiAgICBtYXgtaGVpZ2h0OiAyMHJlbTtcbiAgICBwYWRkaW5nOiAwIDFyZW0gMXJlbSAxcmVtO1xuICAgIGZvbnQtd2VpZ2h0OiBpbml0aWFsO1xuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zaXplOiBpbml0aWFsO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1ib2R5Rm9udCk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIGJveC1zaGFkb3c6IDZweCA2cHggMzZweCAwIHJnYmEoMCwgMCwgMCwgMC4yNSk7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbiAgfVxuXG4gIGgxIHtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgfVxuXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgb3BhY2l0eTogMDtcbiAgdHJhbnNpdGlvbjpcbiAgICBvcGFjaXR5IDAuM3MgZWFzZSxcbiAgICB2aXNpYmlsaXR5IDAuM3MgZWFzZTtcblxuICBAbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAkbW9iaWxlQnJlYWtwb2ludCkge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5hOmhvdmVyIC5wb3BvdmVyLFxuLnBvcG92ZXI6aG92ZXIge1xuICBhbmltYXRpb246IGRyb3BpbiAwLjNzIGVhc2U7XG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xuICBhbmltYXRpb24tZGVsYXk6IDAuMnM7XG59XG4iXX0= */`;var DEFAULT_SANS_SERIF='-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',DEFAULT_MONO="ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace";function googleFontHref(theme){let{code,header,body}=theme.typography;return`https://fonts.googleapis.com/css2?family=${code}&family=${header}:wght@400;700&family=${body}:ital,wght@0,400;0,600;1,400;1,600&display=swap`}__name(googleFontHref,"googleFontHref");function joinStyles(theme,...stylesheet){return`
${stylesheet.join(`

`)}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};

  --headerFont: "${theme.typography.header}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${theme.typography.body}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${theme.typography.code}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
}
`}__name(joinStyles,"joinStyles");import{Features,transform}from"lightningcss";function getComponentResources(ctx){let allComponents=new Set;for(let emitter of ctx.cfg.plugins.emitters){let components=emitter.getQuartzComponents(ctx);for(let component of components)allComponents.add(component)}let componentResources={css:new Set,beforeDOMLoaded:new Set,afterDOMLoaded:new Set};for(let component of allComponents){let{css,beforeDOMLoaded,afterDOMLoaded}=component;css&&componentResources.css.add(css),beforeDOMLoaded&&componentResources.beforeDOMLoaded.add(beforeDOMLoaded),afterDOMLoaded&&componentResources.afterDOMLoaded.add(afterDOMLoaded)}return{css:[...componentResources.css],beforeDOMLoaded:[...componentResources.beforeDOMLoaded],afterDOMLoaded:[...componentResources.afterDOMLoaded]}}__name(getComponentResources,"getComponentResources");function joinScripts(scripts){return scripts.map(script=>`(function () {${script}})();`).join(`
`)}__name(joinScripts,"joinScripts");function addGlobalPageResources(ctx,staticResources,componentResources){let cfg=ctx.cfg.configuration,reloadScript=ctx.argv.serve;if(cfg.enablePopovers&&(componentResources.afterDOMLoaded.push(popover_inline_default),componentResources.css.push(popover_default)),cfg.analytics?.provider==="google"){let tagId=cfg.analytics.tagId;staticResources.js.push({src:`https://www.googletagmanager.com/gtag/js?id=${tagId}`,contentType:"external",loadTime:"afterDOMReady"}),componentResources.afterDOMLoaded.push(`
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag(\`js\`, new Date());
      gtag(\`config\`, \`${tagId}\`, { send_page_view: false });
  
      document.addEventListener(\`nav\`, () => {
        gtag(\`event\`, \`page_view\`, {
          page_title: document.title,
          page_location: location.href,
        });
      });`)}else cfg.analytics?.provider==="plausible"?componentResources.afterDOMLoaded.push(plausible_inline_default):cfg.analytics?.provider==="umami"&&componentResources.afterDOMLoaded.push(`
      const umamiScript = document.createElement("script")
      umamiScript.src = "https://analytics.umami.is/script.js"
      umamiScript["data-website-id"] = "${cfg.analytics.websiteId}"
      umamiScript.async = true
  
      document.head.appendChild(umamiScript)
    `);cfg.enableSPA?componentResources.afterDOMLoaded.push(spa_inline_default):componentResources.afterDOMLoaded.push(`
        window.spaNavigate = (url, _) => window.location.assign(url)
        const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
        document.dispatchEvent(event)`);let wsUrl=`ws://localhost:${ctx.argv.wsPort}`;ctx.argv.remoteDevHost&&(wsUrl=`wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`),reloadScript&&staticResources.js.push({loadTime:"afterDOMReady",contentType:"inline",script:`
          const socket = new WebSocket('${wsUrl}')
          socket.addEventListener('message', () => document.location.reload())
        `})}__name(addGlobalPageResources,"addGlobalPageResources");var defaultOptions11={fontOrigin:"googleFonts"},ComponentResources=__name(opts=>{let{fontOrigin}={...defaultOptions11,...opts};return{name:"ComponentResources",getQuartzComponents(){return[]},async emit(ctx,_content,resources,emit){let componentResources=getComponentResources(ctx);fontOrigin==="googleFonts"&&resources.css.push(googleFontHref(ctx.cfg.configuration.theme)),addGlobalPageResources(ctx,resources,componentResources);let stylesheet=joinStyles(ctx.cfg.configuration.theme,base_default,...componentResources.css),prescript=joinScripts(componentResources.beforeDOMLoaded),postscript=joinScripts(componentResources.afterDOMLoaded);return await Promise.all([emit({slug:"index",ext:".css",content:transform({filename:"index.css",code:Buffer.from(stylesheet),minify:!0,targets:{safari:984576,ios_saf:984576,edge:7536640,firefox:6684672,chrome:7143424},include:Features.MediaQueries}).code.toString()}),emit({slug:"prescript",ext:".js",content:prescript}),emit({slug:"postscript",ext:".js",content:postscript})])}}},"ComponentResources");var NotFoundPage=__name(()=>{let opts={...sharedPageComponents,pageBody:__default(),beforeBody:[],left:[],right:[]},{head:Head,pageBody,footer:Footer}=opts,Body2=Body_default();return{name:"404Page",getQuartzComponents(){return[Head,Body2,pageBody,Footer]},async emit(ctx,_content,resources,emit){let cfg=ctx.cfg.configuration,slug2="404",externalResources=pageResources(slug2,resources),[tree,vfile]=defaultProcessedContent({slug:slug2,text:"Not Found",description:"Not Found",frontmatter:{title:"Not Found",tags:[]}}),componentData={fileData:vfile.data,externalResources,cfg,children:[],tree,allFiles:[]};return[await emit({content:renderPage(slug2,componentData,opts,externalResources),slug:slug2,ext:".html"})]}}},"NotFoundPage");function getStaticResourcesFromPlugins(ctx){let staticResources={css:[],js:[]};for(let transformer of ctx.cfg.plugins.transformers){let res=transformer.externalResources?transformer.externalResources(ctx):{};res?.js&&staticResources.js.push(...res.js),res?.css&&staticResources.css.push(...res.css)}return staticResources}__name(getStaticResourcesFromPlugins,"getStaticResourcesFromPlugins");async function emitContent(ctx,content){let{argv,cfg}=ctx,perf=new PerfTimer,log=new QuartzLogger(ctx.argv.verbose);log.start("Emitting output files");let emit=__name(async({slug:slug2,ext,content:content2})=>{let pathToPage=joinSegments(argv.output,slug2+ext),dir=path11.dirname(pathToPage);return await fs4.promises.mkdir(dir,{recursive:!0}),await fs4.promises.writeFile(pathToPage,content2),pathToPage},"emit"),emittedFiles=0,staticResources=getStaticResourcesFromPlugins(ctx);for(let emitter of cfg.plugins.emitters)try{let emitted=await emitter.emit(ctx,content,staticResources,emit);if(emittedFiles+=emitted.length,ctx.argv.verbose)for(let file of emitted)console.log(`[emit:${emitter.name}] ${file}`)}catch(err){trace(`Failed to emit from plugin \`${emitter.name}\``,err)}log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)}__name(emitContent,"emitContent");var config={configuration:{pageTitle:"\u{1FAB4} Digital Garden",enableSPA:!0,enablePopovers:!0,analytics:{provider:"plausible"},baseUrl:"armanjindal.github.io",ignorePatterns:["private","templates",".obsidian"],defaultDateType:"created",theme:{typography:{header:"Schibsted Grotesk",body:"Source Sans Pro",code:"IBM Plex Mono"},colors:{lightMode:{light:"#faf8f8",lightgray:"#e5e5e5",gray:"#b8b8b8",darkgray:"#4e4e4e",dark:"#2b2b2b",secondary:"#284b63",tertiary:"#84a59d",highlight:"rgba(143, 159, 169, 0.15)"},darkMode:{light:"#161618",lightgray:"#393639",gray:"#646464",darkgray:"#d4d4d4",dark:"#ebebec",secondary:"#7b97aa",tertiary:"#84a59d",highlight:"rgba(143, 159, 169, 0.15)"}}}},plugins:{transformers:[FrontMatter(),TableOfContents(),CreatedModifiedDate({priority:["frontmatter","filesystem"]}),SyntaxHighlighting(),ObsidianFlavoredMarkdown({enableInHtmlEmbed:!1}),GitHubFlavoredMarkdown(),CrawlLinks({markdownLinkResolution:"shortest"}),Latex({renderEngine:"katex"}),Description()],filters:[RemoveDrafts()],emitters:[AliasRedirects(),ComponentResources({fontOrigin:"googleFonts"}),ContentPage(),FolderPage(),TagPage(),ContentIndex({enableSiteMap:!0,enableRSS:!0}),Assets(),Static(),NotFoundPage()]}},quartz_config_default=config;import chokidar from"chokidar";import fs5 from"fs";import{fileURLToPath}from"url";var options={retrieveSourceMap(source){if(source.includes(".quartz-cache")){let realSource=fileURLToPath(source.split("?",2)[0]+".map");return{map:fs5.readFileSync(realSource,"utf8")}}else return null}};sourceMapSupport.install(options);async function buildQuartz(argv,mut,clientRefresh){let ctx={argv,cfg:quartz_config_default,allSlugs:[]},perf=new PerfTimer,output=argv.output,pluginCount=Object.values(quartz_config_default.plugins).flat().length,pluginNames=__name(key=>quartz_config_default.plugins[key].map(plugin=>plugin.name),"pluginNames");argv.verbose&&(console.log(`Loaded ${pluginCount} plugins`),console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`),console.log(`  Filters: ${pluginNames("filters").join(", ")}`),console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`));let release=await mut.acquire();perf.addEvent("clean"),await rimraf(output),console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`),perf.addEvent("glob");let allFiles=await glob("**/*.*",argv.directory,quartz_config_default.configuration.ignorePatterns),fps=allFiles.filter(fp=>fp.endsWith(".md")).sort();console.log(`Found ${fps.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`);let filePaths=fps.map(fp=>joinSegments(argv.directory,fp));ctx.allSlugs=allFiles.map(fp=>slugifyFilePath(fp));let parsedFiles=await parseMarkdown(ctx,filePaths),filteredContent=filterContent(ctx,parsedFiles);if(await emitContent(ctx,filteredContent),console.log(chalk3.green(`Done processing ${fps.length} files in ${perf.timeSince()}`)),release(),argv.serve)return startServing(ctx,mut,parsedFiles,clientRefresh)}__name(buildQuartz,"buildQuartz");async function startServing(ctx,mut,initialContent,clientRefresh){let{argv}=ctx,ignored=await isGitIgnored(),contentMap=new Map;for(let content of initialContent){let[_tree,vfile]=content;contentMap.set(vfile.data.filePath,content)}let initialSlugs=ctx.allSlugs,lastBuildMs=0,toRebuild=new Set,toRemove=new Set,trackedAssets=new Set;async function rebuild(fp,action){if(ignored(fp))return;fp=toPosixPath(fp);let filePath=joinSegments(argv.directory,fp);if(path12.extname(fp)!==".md"){action==="add"||action==="change"?trackedAssets.add(filePath):action==="delete"&&trackedAssets.delete(filePath),clientRefresh();return}action==="add"||action==="change"?toRebuild.add(filePath):action==="delete"&&toRemove.add(filePath);let buildStart=new Date().getTime();lastBuildMs=buildStart;let release=await mut.acquire();if(lastBuildMs>buildStart){release();return}let perf=new PerfTimer;console.log(chalk3.yellow("Detected change, rebuilding..."));try{let filesToRebuild=[...toRebuild].filter(fp2=>!toRemove.has(fp2)),trackedSlugs=[...new Set([...contentMap.keys(),...toRebuild,...trackedAssets])].filter(fp2=>!toRemove.has(fp2)).map(fp2=>slugifyFilePath(path12.posix.relative(argv.directory,fp2)));ctx.allSlugs=[...new Set([...initialSlugs,...trackedSlugs])];let parsedContent=await parseMarkdown(ctx,filesToRebuild);for(let content of parsedContent){let[_tree,vfile]=content;contentMap.set(vfile.data.filePath,content)}for(let fp2 of toRemove)contentMap.delete(fp2);let parsedFiles=[...contentMap.values()],filteredContent=filterContent(ctx,parsedFiles);await rimraf(argv.output),await emitContent(ctx,filteredContent),console.log(chalk3.green(`Done rebuilding in ${perf.timeSince()}`))}catch{console.log(chalk3.yellow("Rebuild failed. Waiting on a change to fix the error..."))}clientRefresh(),toRebuild.clear(),toRemove.clear(),release()}__name(rebuild,"rebuild");let watcher=chokidar.watch(".",{persistent:!0,cwd:argv.directory,ignoreInitial:!0});return watcher.on("add",fp=>rebuild(fp,"add")).on("change",fp=>rebuild(fp,"change")).on("unlink",fp=>rebuild(fp,"delete")),async()=>{await watcher.close()}}__name(startServing,"startServing");var build_default=__name(async(argv,mut,clientRefresh)=>{try{return await buildQuartz(argv,mut,clientRefresh)}catch(err){trace(`
Exiting Quartz due to a fatal error`,err)}},"default");export{build_default as default};
//# sourceMappingURL=transpiled-build.mjs.map
