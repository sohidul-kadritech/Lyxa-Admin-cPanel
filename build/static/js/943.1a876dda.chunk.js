"use strict";(self.webpackChunklyxa_admin_console=self.webpackChunklyxa_admin_console||[]).push([[943],{28121:function(n,i,l){var e,o=l(30168),t=(l(47313),l(77338)),c=l(21422),r=l(64904),a=l(46417);var d=r.ZP.div(e||(e=(0,o.Z)(["\n  .border {\n    border-bottom: ",";\n    width: 20px;\n  }\n\n  .img_wrapper {\n    width: 65px;\n    height: 65px;\n    text-align: center;\n    padding: 5px;\n    border-radius: 5px;\n    background-color: #e8e2f7;\n\n    img {\n      width: 100%;\n    }\n  }\n\n  .value {\n    padding-left: 20px;\n    font-weight: 28px;\n  }\n"])),(function(n){var i=n.color;return"2px solid ".concat(i," !important")}));i.Z=function(n){var i=n.title,l=n.value,e=n.icon,o=n.color;return(0,a.jsx)(t.Z,{className:"mini-stat",style:{height:"140px"},children:(0,a.jsx)(c.Z,{children:(0,a.jsxs)(d,{color:o,children:[(0,a.jsx)("h5",{className:"font-size-14",children:i}),(0,a.jsx)("div",{className:"border"}),(0,a.jsxs)("div",{className:"d-flex mt-2",children:[(0,a.jsx)("div",{className:"img_wrapper",children:(0,a.jsx)("img",{src:e,alt:""})}),(0,a.jsx)("h4",{className:"value",children:null!==l&&void 0!==l?l:0})]})]})})})}},6943:function(n,i,l){l.r(i);var e=l(93433),o=l(47313),t=l(34382),c=l(20587),r=l(92286),a=l(71730),d=l(96688),s=l(10037),A=l(14638),u=l(28121),g=l(88161),h=l(55994),v=l(80908),J=l(74417),x=l(5509),p=l(46417),f=(0,o.lazy)((function(){return l.e(576).then(l.bind(l,26576))}));i.default=function(n){var i,l,w,D,Y,W,Z,O,z,b,j,m,B=n.summary,R=(0,x.b)(),T=R.currentUser,y=R.general,M=null===y||void 0===y||null===(i=y.currency)||void 0===i?void 0:i.symbol,V=T.shop,E=[{id:1,title:"Earnings",subTitle:"(Total earnings)",value:"".concat(null!==(l=null===B||void 0===B||null===(w=B.totalShopEarning)||void 0===w?void 0:w.toFixed(2))&&void 0!==l?l:0," ").concat(M),icon:r,iconBg:"#0008C1"},{id:2,title:"Total Profit",subTitle:"(From order amount)",value:"".concat(null!==(D=null===B||void 0===B||null===(Y=B.toalShopProfile)||void 0===Y?void 0:Y.toFixed(2))&&void 0!==D?D:0).concat(M),icon:s,iconBg:"#56ca00"},{id:5,title:"Order Amount",subTitle:"(Ex delivery fees)",value:"".concat(null!==(W=null===B||void 0===B||null===(Z=B.orderValue)||void 0===Z||null===(O=Z.productAmount)||void 0===O?void 0:O.toFixed(2))&&void 0!==W?W:0," ").concat(M),icon:d,iconBg:"#ff5ca7"},{id:6,title:"Unsettled Amount",subTitle:"(Total unsettled)",value:"".concat(null!==(z=null===B||void 0===B||null===(b=B.totalShopUnsettle)||void 0===b?void 0:b.toFixed(2))&&void 0!==z?z:0," ").concat(M),icon:a,iconBg:"#0c9da4"}],F=[{id:3,title:"Delivery Profit",subTitle:"(Only from own riders)",value:"".concat((null===B||void 0===B||null===(j=B.orderValue)||void 0===j||null===(m=j.deliveryFee)||void 0===m?void 0:m.toFixed(2))||0," ").concat(M),icon:A,iconBg:"#1A4D2E"}];return null!==V&&void 0!==V&&V.haveOwnDeliveryBoy&&(E=[].concat((0,e.Z)(E),F)),(0,p.jsxs)(g.Z,{children:[E.length>0&&(0,p.jsx)(h.Z,{data:E}),(0,p.jsx)(t.Z,{children:(0,p.jsx)(o.Suspense,{fallback:(0,p.jsx)("div",{children:"Loading..."}),children:(0,p.jsx)(f,{graphType:"earning"})})}),(0,p.jsxs)(t.Z,{children:[(0,p.jsx)(c.Z,{xl:4,md:6,children:(0,p.jsx)(u.Z,{title:"Deliverd Orders",value:null===B||void 0===B?void 0:B.totalDeliverOrder,icon:v,color:"#459ed8"})}),(0,p.jsx)(c.Z,{xl:4,md:6,children:(0,p.jsx)(u.Z,{title:"Cancel Orders",value:null===B||void 0===B?void 0:B.totalCancelOrder,icon:J,border:"#f05179",color:"#8c54ff"})})]}),(0,p.jsx)(t.Z,{children:(0,p.jsx)(o.Suspense,{fallback:(0,p.jsx)("div",{children:"Loading..."}),children:(0,p.jsx)(f,{graphType:"order"})})})]})}},80908:function(n){n.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAABHNCSVQICAgIfAhkiAAABYVJREFUeF7tnT12EzEQx6UFHiVwApwG4go4AcvDrgknIE7oCScgnIDQ4zicAFM7vDg3MJUNTcwJCCUfz8NsiN8Dk7U0s5JWux43KaKRNP+fRrP68FqrCn7S3sn1S/DjUQIqBQ0NrdR1dOPu3BVQaqhBT/F//V/66vGws3ZaNTfRp+p8Wr1xqkC/wE6nlF4DqL5K4PVhpzmk2JVZthJguEAWhc0iSWl4WQVA0YNpdSevtFY7LkcvRtDe4fb6c5d1uq4rWjBZHrkC34/+zh2OnR/91FcfxJp/ogQTAMqccbRwogMTEErUcKID09qfHNk+dWGu+KbxkRj/TtFmmimNCb6BOakBoDfw7zWr6Q/0wWD7dseqbKBCUYF5+ObTRpLAO7PvcDybJXsfnt7uLyvb7o43EdSu1vqmqc7ZTD821Weqw+X/owGTTWGX4fvJ+WIx10eMjuf4RLVHEaHVHWdwXhhspoOt9TVKvT7LRgPGJN7ZtJUk6aBza8QRJIsepXVvqS1AZ7DdPODU79omGjDt/ckJOtfIc9DFVGMBJ5qoiQJMtrLHva1szXLhB/PE+8Ot9Q0Xo7K9Px4qpe/n1qWTe9yodNG/eR1RgMFoyXLGszzHfmpYG3aaUxeOp71x4wroLDovHgSMHOaiX4t1RAImfxS7jJa58+3uZKS0unORoD7a44CLAgyuXb7mPY0B4KbjdnOX41yezbIHDQRzitPmDZftceqKAgxOZahHztSi4YHr3WDTegkfm0vXpfQOGBO/BzCmNgUMBolJJDyFdB4xZbRJnc4kYi5QzMdgqB0YH9OKRIzFMDGJ5AOMcS3jYfq0kOKfItFPZS4Xl3PPTYNBpjJJ/rmBFH3E+Bi9EjEWE2sZIpXRpoUU1coxEjFUpI7KlzF6y2iTKpfkmLouMLMNQbyp8gS30bOL3eTP4oVwcgV+DEbZLjOralCneEPnbdGLHYUixnROz3KsJkZFjyvYYEyr55roW8iNIotjNhjTmUYhj+piXODWDRuMTGPm0VNkOhMwZn3ZJQQMWzq/hqWAMd7P8utzRWqHt4Ot5ians+ypTMDYyA3HCCa1KblYRsBwVLO2ETDWUoUtWAqY5ZfAwwoQa2vlgMm9pBerTGX0i3tnoUCOyb89WYYAsbYpYCIlI2AEjPlaa6QaldIt7g4zK8eYjmZLUSDSRrl3FgSMZ6ACxrPA3OqDgrH49i/Xj9rZBQUjh2T244e79c/LMXZvmrDvfY1LCphI4QoYAaOUHJJRRgHvFJOVYwQMCQzrFFPAUDRmleWdyQgYltgUo6Bg5PTSHk1YMHJ6aU9Gcc5kmFOZnF4SuAgYilghy0rEhFSb0FYQMHJIRiByXpRziknOMQKGDoaz9S9g6DqTLQQMWbIwBmHAdCc7+M78V2FcqkcrnHdG06cyOSQjjxbOmYyAIctMNxAwdM2CWAQBY3qreBBPK9ZIIDCGd+NXTLQQ3eW8/ZycY+T0koOSvvUvYDg6k20EDFmyMAZBwMhZDAPmCHeY71HsGFOZgKEIPC9L3foXMByVGTYChiFaCBOvYM5/1fVrCEfq1oZXMHJIxh8u1K1/Uo4RMAKGr0CklhIxqwhGvnvJp079jWhajpHTSzYZ6ta/gGFLTTMUMDS9gpUWMMGkpjUkYGh6BSstYIJJTWtIwND0ClbaKxj5oQU+R68rf9ld5oOhfhWDtI7JutXan/TR6BG/i6toSX8JAx1Mb5xq0EerKC/XZ+o0lrVDBpMZyW1Me0TUpD+vmQXmD5zxAXJ9Yt/FVSxJn8IKg5HIWT7QuJHiBMzZw8BZzlG7GD33VzEm/vMZ1EdIYOew0xwW0YM9lS022u59vqtgtqlApZi57hTpVNVsMTq+aK37SicHg86tkYv+/wZL6Y2UHLGIQgAAAABJRU5ErkJggg=="},74417:function(n){n.exports="data:image/png;base64,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"}}]);