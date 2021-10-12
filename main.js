const url = "docs.pdf";

let pdfDoc = null,
pageNum = 1,
pageIsrendering=false,
pageNumIsPending=null;

const scale = 1.9,
canvas = document.querySelector("#pdf-render");
ctx = canvas.getContext("2d");


const renderPage = num=>{
pageIsrendering=true,

pdfDoc.getPage(num).then(page=>{
  const viewport = page.getViewport({scale});
  canvas.height = viewport.height;
  canvas.width = viewport.width;

const renderCtx = {
  canvasContext: ctx,
  viewport
}

  page.render(renderCtx).promise.then(()=>{
    pageIsRendering= false;

    if (pageNumIsPending !==null) {
      renderPage(pageNumIsPending);
      pageNumIsPending = null;
    }
  });

  document.querySelector("#page-num").textContent = num;

})
};

const queRenderPage = num =>{
  if (pageIsRendering) {
    pageNumIsPending = num;
  }
  else {
    renderPage(num);
  }
}


const showPrevPage = () =>{
if (pageNum <= 1) {
  return;
}
pageNum--;
queRenderPage(pageNum)
}

const showNextPage = () =>{
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queRenderPage(pageNum);
  }

pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>{
  pdfDoc = pdfDoc_;
  document.querySelector("#page-count").textContent = pdfDoc.numPages;

renderPage(pageNum);
})

.catch(err=>{
  const div = document.createElement('div');
  div.className = 'error';
  div.appendChild(document.createTextNode(err.message));
  document.querySelector("body").insertBefore(div, canvas);

  document.querySelector(".top-bar").style.display = "none";
})

//Button Events
document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);