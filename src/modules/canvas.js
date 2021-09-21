export function createCanvas(parent, id, width, height) {
  let canvasElem = document.createElement("canvas");
  let parentElem = document.getElementById(parent);
  parentElem.appendChild(canvasElem);

  canvasElem.id = id;
  canvasElem.width = width;
  canvasElem.height = height;

  let ctx = canvasElem.getContext("2d");

  return {
    ctx: ctx,
    id: id,
    width: width,
    height: height,
  };
}
