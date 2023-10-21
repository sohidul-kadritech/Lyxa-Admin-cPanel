/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
export const dummyLocationRider = [
  {
    lat: 23.774390073503145,
    lng: 90.41418541219299,
  },

  {
    lat: 23.774394982696215,
    lng: 90.4141827299843,
  },

  {
    lat: 23.774390073503145,
    lng: 90.41431147600194,
  },

  {
    lat: 23.774372233228494,
    lng: 90.41452009867814,
  },

  {
    lat: 23.774355051048925,
    lng: 90.4146971244524,
  },

  {
    lat: 23.77433786886709,
    lng: 90.41508068029664,
  },

  {
    lat: 23.774276503913445,
    lng: 90.41577269014148,
  },
  {
    lat: 23.774251957923873,
    lng: 90.4160650508899,
  },
];

export const getTitleForMarker = (title) => `<div style="padding:4px 8px 0px;position:relative;right:8px; width:auto;">
    <p style="text-align:center;font-size:16px;font-weight:bold;color:#5E97A9;cursor:pointer;"
    ><b>${title}</b></p>
  </div>`;
// for store
export const getTitleForStoreMarker = (
  title,
  imageUrl,
) => `<div style="padding:4px 8px 0px;position:relative;right:8px; width:auto;display: flex;flex-direction:column; justify-content: center; align-items: center;gap:10px;">
<img style="width:80px;height:80px;object-fit:contained;" src=${imageUrl} alt="store_image"/>
    <p style="text-align:center;font-size:16px;font-weight:bold;color:#5E97A9;cursor:pointer;"
    ><b>${title}</b></p>
  </div>`;
