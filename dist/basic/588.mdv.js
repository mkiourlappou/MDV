"use strict";(self.webpackChunkciview2=self.webpackChunkciview2||[]).push([[588],{1588:(e,t,a)=>{a.r(t),a.d(t,{default:()=>d});var n=a(7737);class d extends n.Z{constructor(){if(super(),"undefined"==typeof createImageBitmap)throw new Error("Cannot decode WebImage as `createImageBitmap` is not available");if("undefined"==typeof document&&"undefined"==typeof OffscreenCanvas)throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available")}async decode(e,t){const a=new Blob([t]),n=await createImageBitmap(a);let d;"undefined"!=typeof document?(d=document.createElement("canvas"),d.width=n.width,d.height=n.height):d=new OffscreenCanvas(n.width,n.height);const i=d.getContext("2d");return i.drawImage(n,0,0),i.getImageData(0,0,n.width,n.height).data.buffer}}}}]);