import { useState, useEffect } from "react";

var MSGS=["Assembling blocks...","Calibrating monitor...","Reviewing the chart...","Stocking med cart...","Writing the debrief..."];

export function BuilderPreview(){
  var _mi=useState(0);var mi=_mi[0];var setMi=_mi[1];
  useEffect(function(){var iv=setInterval(function(){setMi(function(p){return(p+1)%MSGS.length;});},2500);return function(){clearInterval(iv);};},[]);
  return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#0a0e1a,#1a1a3e)"}}>
    <style>{"@keyframes bbl{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.1)}100%{transform:translateY(0) scale(1)}}.bbx>div:nth-child(1){animation:bbl 1.5s ease infinite}.bbx>div:nth-child(2){animation:bbl 1.5s ease .2s infinite}.bbx>div:nth-child(3){animation:bbl 1.5s ease .4s infinite}.bbx>div:nth-child(4){animation:bbl 1.5s ease .6s infinite}"}</style>
    <div className="bbx" style={{display:"flex",gap:12,marginBottom:32}}><div style={{width:40,height:40,borderRadius:8,background:"#4ECDC4"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FF6B81"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#FECA57"}}></div><div style={{width:40,height:40,borderRadius:8,background:"#a55eea"}}></div></div>
    <p style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Building Your Scenario</p>
    <p style={{fontSize:14,color:"#4ECDC4"}}>{MSGS[mi]}</p></div>);
}
