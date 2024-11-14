export interface MahalleData {
    [apartman: string]: number[]; // Her apartman, içinde daire numaralarını içeren bir dizi bulundurur.
  }
  
  export interface IlceData {
    [mahalle: string]: MahalleData; // Her mahallede birden fazla apartman olabilir.
  }
  
  export interface IlData {
    [ilce: string]: IlceData; // Her ilçede birden fazla mahalle olabilir.
  }
  
  export interface Data {
    "Türkiye": {
      [il: string]: IlData; // Türkiye'de birden fazla il bulunur.
    };
  }
  
  const AddressData = {
    "Türkiye": {
      İstanbul: {
        Kadıköy: {
          Acıbadem: {
            1: [1, 2, 3],
            2: [1, 2]
          },
          Fenerbahçe: {
            1: [1, 2],
            2: [1, 2, 3, 4]
          },
          Kozyatağı: {
            1: [1, 2, 3, 4]
          }
        },
        Beşiktaş: {
          Etiler: {
            1: [1, 2, 3]
          },
          Levent: {
            1: [1, 2],
            2: [1]
          },
          Ortaköy: {
            1: [1, 2]
          }
        },
        Üsküdar: {
          Çengelköy: {
            1: [1, 2, 3]
          },
          Kuzguncuk: {
            1: [1, 2],
            2: [1]
          },
          Beylerbeyi: {
            1: [1]
          }
        },
        Bakırköy: {
          Ataköy: {
            1: [1, 2, 3],
            2: [1, 2]
          },
          Yeşilköy: {
            1: [1, 2, 3]
          },
          Florya: {
            1: [1, 2]
          }
        },
        Şişli: {
          Maçka: {
            1: [1, 2]
          },
          Nişantaşı: {
            1: [1, 2, 3]
          },
          Bomonti: {
            1: [1]
          }
        }
      },
      Ankara: {
        Çankaya: {
          Bahçelievler: {
            1: [1, 2],
            2: [1, 2, 3]
          },
          Çayyolu: {
            1: [1]
          },
          Kızılay: {
            1: [1, 2, 3]
          }
        },
        Keçiören: {
          Etlik: {
            1: [1, 2]
          },
          Kuşcağız: {
            1: [1]
          },
          Bağlum: {
            1: [1, 2, 3]
          }
        },
        Yenimahalle: {
          Demetevler: {
            1: [1, 2, 3]
          },
          Batıkent: {
            1: [1, 2]
          },
          İvedik: {
            1: [1]
          }
        },
        Mamak: {
          BüyükKayaş: {
            1: [1]
          },
          ŞahinTepesi: {
            1: [1, 2]
          },
          Gökçek: {
            1: [1, 2, 3]
          }
        }
      },
      İzmir: {
        Konak: {
          Alsancak: {
            1: [1, 2, 3]
          },
          Kemeraltı: {
            1: [1, 2]
          },
          Basmane: {
            1: [1]
          }
        },
        Karşıyaka: {
          Bostanlı: {
            1: [1, 2]
          },
          Çarşı: {
            1: [1, 2, 3]
          },
          Yalı: {
            1: [1]
          }
        },
        Bornova: {
          "Ege Üniversitesi": {
            1: [1]
          },
          Işıkkent: {
            1: [1, 2]
          },
          Köyceğiz: {
            1: [1, 2, 3]
          }
        }
      },
      Antalya: {
        Muratpaşa: {
          Kaleiçi: {
            1: [1, 2]
          },
          Konyaaltı: {
            1: [1, 2, 3]
          },
          Lara: {
            1: [1]
          }
        },
        Kepez: {
          Santral: {
            1: [1, 2]
          },
          "Süleyman Demirel": {
            1: [1, 2, 3]
          },
          Aksu: {
            1: [1]
          }
        },
        Alanya: {
          Mahmutlar: {
            1: [1]
          },
          Oba: {
            1: [1, 2]
          },
          Kestel: {
            1: [1, 2, 3]
          }
        }
      }
    }
  };
  
  export default AddressData;