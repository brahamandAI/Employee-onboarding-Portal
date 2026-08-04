/**
 * Overlay coordinates for the official Rakshak Securitas ID card template.
 * Template source: public/brand/id-card-template-{front|back}.png (459×729 px).
 * PDF card size: 153×243 pt (scale factor 1/3).
 */

export const ID_CARD_WIDTH_PT = 153;
export const ID_CARD_HEIGHT_PT = 243;
export const TEMPLATE_SCALE = ID_CARD_WIDTH_PT / 459;

export function px(value: number): number {
  return value * TEMPLATE_SCALE;
}

export const ID_CARD_FRONT_LAYOUT = {
  photo: { x: px(118), y: px(268), w: px(224), h: px(150), radius: px(14) },
  nameCover: { x: px(95), y: px(498), w: px(270), h: px(22) },
  designationCover: { x: px(95), y: px(518), w: px(270), h: px(32) },
  name: { y: px(504), fontSize: 11 },
  designation: { y: px(532), fontSize: 8 },
  branch: { x: px(175), y: px(568), w: px(200), fontSize: 7.5 },
  empId: { x: px(175), y: px(592), w: px(200), fontSize: 7.5 },
  validUpto: { x: px(175), y: px(616), w: px(200), fontSize: 7.5 },
  bloodGroup: { x: px(175), y: px(640), w: px(200), fontSize: 7.5 },
} as const;

export const ID_CARD_BACK_LAYOUT = {
  dob: { x: px(95), y: px(48), w: px(280), fontSize: 7.5 },
  address: { x: px(95), y: px(88), w: px(320), fontSize: 6.5, lineHeight: 8 },
  qr: { x: px(56), y: px(473), w: px(134), h: px(86) },
} as const;

/** A6 page (portrait) in PDF points */
export const A6_PAGE: [number, number] = [298.11, 419.53];

export function cardOriginOnA6(): { x: number; y: number } {
  return {
    x: (A6_PAGE[0] - ID_CARD_WIDTH_PT) / 2,
    y: (A6_PAGE[1] - ID_CARD_HEIGHT_PT) / 2,
  };
}

export const ID_CARD_COMPANY = {
  name: "Rakshak Securitas Pvt Ltd",
  addressLines: [
    "Registered & Corporate Office",
    "T-5, Plot No.12",
    "Manish Plaza III",
    "Sector-10, Dwarka",
    "New Delhi – 110075",
  ],
  website: "www.rakshaksecuritas.com",
  recruitmentEmail: "recruitment@rakshaksecuritas.com",
  phone: "011-42760103",
  mobile: "+91-9212663517",
} as const;

export const ID_CARD_TERMS = [
  "This is a Computer Generated ID Card and does not require a physical signature.",
  "The card remains the property of Rakshak Securitas Pvt Ltd.",
  "Employees must carry this ID card while on duty.",
  "Loss of the ID card must be immediately reported to the HR Department.",
  "The ID card must be surrendered upon resignation, termination, or retirement.",
  "If found, please return it to the Corporate Office of Rakshak Securitas Pvt Ltd.",
] as const;

export const ID_CARD_DESIGNATION_BAR = "#001A57";
