export type ClientConfig = {
  name: string;
  token: string;
  sheetBase: string;
  timelineGid: string;
  eventsGid: string;
  emq: number;
};

export const CLIENTS: Record<string, ClientConfig> = {
  valy: {
    name: 'Valy Agency',
    token: 'vs9x2k',
    sheetBase: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBOCGJDpFScDWOETg-aa1EZizSSgvpbyoRpGV8k1kzPvR72rpzBud4GcGySs7inK1gRFkKrPZ7sSc0/pub',
    timelineGid: '1912143400',
    eventsGid: '0',
    emq: 4.6,
  },
  // Para agregar un cliente nuevo:
  // ecoterra: {
  //   name: 'Ecoterra',
  //   token: 'et7m3p',
  //   sheetBase: 'URL_DEL_SHEET',
  //   timelineGid: 'GID',
  //   eventsGid: 'GID',
  //   emq: 4.6,
  // },
};