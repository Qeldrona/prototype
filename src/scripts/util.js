import { useRouter } from "next/router";
import {
  useEffect,
  useRef
} from "react";

// Constants
// import appRoutes from "/src/scripts/constant-types/appRoutes";
// import { keys } from "/src/scripts/constant-types/pageContent";

export const addDays = (date, days) => {
  const currentDate = new Date(Number(date));
  const copy = new Date(currentDate);
  copy.setDate(currentDate.getDate() + days);

  return copy;
};

/*
 * TODO: we should think remove this function.
 * padStart method form String.prototype does the trick.
 */
export const addZerosToStoreNumber = number => {
  const numberLength = number.toString().length;

  const addZeros = 4 - numberLength;

  if (addZeros !== 0) {
    for (let i = 0; i < addZeros; i++) {
      number = "0" + number;
    }
  }
  return number;
};

export const formatName = name => {
  if (name) {
    return name.toLowerCase().replace(/ /g, "_");
  } else {
    return "";
  }
};

export const getUrlWithoutQuery = url => {
  const result = /(\/?[^?]*?)\?.*/.exec(url);

  return (result && result[1]) || url;
};

export const capitalizeEachWord = string => {
  const wordArray = string.trim().split(" ");
  const capitalizedWordArray = wordArray.map(w => {
    return `${w[0].toUpperCase()}${w.substring(1)}`;
  });

  return capitalizedWordArray.join(" ");
};

/**
 * Formats phone numbers to expressions like (123) - 456 7890
 * or +1 (123) 456 7890
 *
 * @param {*} phoneNumber
 * @returns
 */
export const formatPhoneNumber = phoneNumber => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [
      intlCode,
      "(",
      match[2],
      ") ",
      match[3],
      "-",
      match[4],
    ].join("");
  }

  return null;
};

export const formatUnitSizeDisplay = (dimension, size) => {
  const dimensions = dimension.toUpperCase().split("X");
  return `${dimensions[0]} x ${dimensions[1]} ${size}`;
};

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getAge = dateString => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getWeekDay = date => weekday[date.getDay()];

export const emailRegex = RegExp(
  /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/
);

export const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

export const isValidUrl = string => {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }
  return true;
};

export const setUrlToEnvironment = url => {
  const host = process.env.PHX_URL_HOSTNAME;
  const extraSpaceDomain = "https://www.extraspace.com";

  if (url) {
    if (url.indexOf(extraSpaceDomain >= 0)) {
      url = url.replace(extraSpaceDomain, host);
    }

    url = url.replace(/ /g, "_");
  }

  return url;
};

export const setBestPricedUnits = (
  locations,
  bestPricedUnits,
  setBestPricedUnits
) => {
  const sizes = {
    large: "large",
    medium: "medium",
    small: "small",
  };

  const findBestPricedUnit = array => {
    let cheapestUnit = null;
    array.forEach(i => {
      if (i.unit.rates.web !== 0 && i.unit.dimensions.display !== "") {
        if (
          cheapestUnit === null ||
          i.unit.rates.web < cheapestUnit.unit.rates.web
        ) {
          cheapestUnit = i;
        }
      }
    });
    return cheapestUnit;
  };

  const bestPricesSmallArr = [];
  const bestPricesMediumArr = [];
  const bestPricesLargeArr = [];

  if (locations && locations.length > 0) {
    const limit = locations.length >= 10 ? 10 : locations.length;

    for (let index = 0; index < limit; index++) {
      locations[index].bestPrice.forEach(unit => {
        const unitData = {
          index: index + 1,
          store: locations[index],
          unit,
        };

        switch (unit.dimensions.size.toLowerCase()) {
          case sizes.small:
            bestPricesSmallArr.push(unitData);
            break;
          case sizes.medium:
            bestPricesMediumArr.push(unitData);
            break;
          case sizes.large:
            bestPricesLargeArr.push(unitData);
            break;
        }
      });
    }

    const bestPricedSmallUnit = findBestPricedUnit(bestPricesSmallArr);
    const bestPricedMediumUnit = findBestPricedUnit(bestPricesMediumArr);
    const bestPricedLargeUnit = findBestPricedUnit(bestPricesLargeArr);

    if (
      [
        bestPricedSmallUnit,
        bestPricedMediumUnit,
        bestPricedLargeUnit,
      ].every(
        unit => {
          return unit === null;
        }
      )
    ) {
      setBestPricedUnits({
        ...bestPricedUnits,
        hasUnits: false,
      });
    } else {
      setBestPricedUnits({
        ...bestPricedUnits,
        hasUnits: true,
        large:
          bestPricedLargeUnit && bestPricedLargeUnit.store
            ? bestPricedLargeUnit
            : undefined,
        medium:
          bestPricedMediumUnit && bestPricedMediumUnit.store
            ? bestPricedMediumUnit
            : undefined,
        small:
          bestPricedSmallUnit && bestPricedSmallUnit.store
            ? bestPricedSmallUnit
            : undefined,
      });
    }
  } else {
    setBestPricedUnits({
      ...bestPricedUnits,
      hasUnits: false,
    });
  }
};

export const shouldShowPromoAsterisk = entity => {
  if (
    entity.promotion &&
    entity.promotion.toString().toLowerCase() !== "flash sale"
  ) {
    return true;
  }
  return false;
};

export const usePreviousStateValue = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const formatHours = hours => {
  return hours !== undefined
    ? hours.toLowerCase().replace(/\s/g, "")
    : "Call for hours";
};

export const getHoursOfOperationInfo = (
  hoursOfOperationLabels,
  hours
) => {
  const weekDaySchedules = [
    hours.monday,
    hours.tuesday,
    hours.wednesday,
    hours.thursday,
    hours.friday,
  ];

  const weekDaysHaveSameSchedule = weekDaySchedules.every(
    x => x === hours.monday
  );

  const weekdays = `${hoursOfOperationLabels.weekdaysLabel} ${formatHours(
    hours.monday
  )}`;

  const monday = `${hoursOfOperationLabels.mondayLabel} ${formatHours(
    hours.monday
  )}`;

  const tuesday = `${hoursOfOperationLabels.tuesdayLabel} ${formatHours(
    hours.tuesday
  )}`;

  const wednesday = `${hoursOfOperationLabels.wednesdayLabel} ${formatHours(
    hours.wednesday
  )}`;

  const thursday = `${hoursOfOperationLabels.thursdayLabel} ${formatHours(
    hours.thursday
  )}`;

  const friday = `${hoursOfOperationLabels.fridayLabel} ${formatHours(
    hours.friday
  )}`;

  const saturday = `${hoursOfOperationLabels.saturdayLabel} ${formatHours(
    hours.saturday
  )}`;

  const sunday = `${hoursOfOperationLabels.sundayLabel} ${formatHours(
    hours.sunday
  )}`;

  const officeHoursOfOperationInfo = {
    friday,
    monday,
    saturday,
    sunday,
    thursday,
    tuesday,
    wednesday,
    weekDaysHaveSameSchedule,
    weekdays,
  };

  return officeHoursOfOperationInfo;
};

export const hoursOfOperationLabelInfo = hoursOfOperationLabels => {
  const {
    storageOfficeHoursText,
  } = hoursOfOperationLabels;

  const {
    storageGateHoursText,
  } = hoursOfOperationLabels;

  const {
    currentCustomerLabel,
  } = hoursOfOperationLabels;

  const {
    hoursOfOperationText,
  } = hoursOfOperationLabels;

  const {
    newCustomerLabel,
  } = hoursOfOperationLabels;

  const {
    customerServiceHoursText,
  } = hoursOfOperationLabels;

  const hoursOfOperationLabelInfo = {
    currentCustomerLabel,
    customerServiceHoursText,
    hoursOfOperationText,
    newCustomerLabel,
    storageGateHoursText,
    storageOfficeHoursText,
  };

  return hoursOfOperationLabelInfo;
};

export const getGateHoursOfOperation = (
  gateHoursOfOperationJSON,
  allDaysLabel
) => {
  return `${allDaysLabel} ${formatHours(gateHoursOfOperationJSON.monday)}`;
};

export const getWeekdayOfficeHoursOfOperation = (
  officeHoursOfOperationJSON,
  weekDaysLabel
) => {
  return `${weekDaysLabel} ${formatHours(officeHoursOfOperationJSON.monday)}`;
};

export const getHoursOfOperationJSON = (hoursOfOperation, type) => {
  const hoursOfOperationJSON = hoursOfOperation.find(
    x => x.type.toLowerCase() === type
  );

  hoursOfOperationJSON.monday = formatHours(
    hoursOfOperationJSON.monday
  );

  hoursOfOperationJSON.tuesday = formatHours(
    hoursOfOperationJSON.tuesday
  );

  hoursOfOperationJSON.wednesday = formatHours(
    hoursOfOperationJSON.wednesday
  );

  hoursOfOperationJSON.thursday = formatHours(
    hoursOfOperationJSON.thursday
  );

  hoursOfOperationJSON.friday = formatHours(
    hoursOfOperationJSON.friday
  );

  hoursOfOperationJSON.saturday = formatHours(
    hoursOfOperationJSON.saturday
  );

  hoursOfOperationJSON.sunday = formatHours(
    hoursOfOperationJSON.sunday
  );

  return hoursOfOperationJSON;
};

export const getSaturdayOfficeHoursOfOperation = (
  officeHoursOfOperationJSON,
  saturdayLabel
) => {
  return `${saturdayLabel} ${formatHours(officeHoursOfOperationJSON.saturday)}`;
};

export const getSundayOfficeHoursOfOperation = (
  officeHoursOfOperationJSON,
  sundayLabel
) => {
  return `${sundayLabel} ${formatHours(officeHoursOfOperationJSON.sunday)}`;
};

export const getFacilityPhotosForCarouselModal = siteNumber => {
  const images = [];

  images.push({
    key: 0,
    src: `${process.env.PHX_CDN_LINK}600x450-${siteNumber}.jpg`,
  });

  for (let i = 1; i <= 6; i++) {
    images.push({
      key: i,
      src: `${process.env.PHX_CDN_LINK}600x450-${siteNumber}_${i}.jpg`,
    });
  }

  return images;
};

export const getHoursOfOperationLabels = content => {
  const {
    hoursOfOperation: {
      fields: {
        allDaysLabel,
        currentCustomerLabel,
        customerServiceHoursText,
        fridayLabel,
        hoursOfOperationText,
        mondayLabel,
        newCustomerLabel,
        saturdayLabel,
        storageGateHoursText,
        storageOfficeHoursText,
        sundayLabel,
        thursdayLabel,
        tuesdayLabel,
        weekdaysLabel,
        wednesdayLabel,
      } = {},
    } = {},
  } = content;

  const hoursOfOperationLabels = {
    allDaysLabel,
    currentCustomerLabel,
    customerServiceHoursText,
    fridayLabel,
    hoursOfOperationText,
    mondayLabel,
    newCustomerLabel,
    saturdayLabel,
    storageGateHoursText,
    storageOfficeHoursText,
    sundayLabel,
    thursdayLabel,
    tuesdayLabel,
    wednesdayLabel,
    weekdaysLabel,
  };

  return hoursOfOperationLabels;
};

export const getMonthYearFromDate = date => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const convertedDate = new Date(date);

  const month = monthNames[convertedDate.getMonth()];
  const year = convertedDate.getFullYear();

  return `${month} ${year}`;
};

/**
 * Groups by key an array of values.
 *
 * @param {*} key Key to group by.
 * @param {*} values Array of values to be grouped.
 * @returns Grouped values by specified key.
 */
export const groupBy = (key, values) => {
  return values.reduce((acc, curr) => {
    const keyValue = curr[key];
    acc[keyValue] = [...(acc[keyValue] || []), curr];

    return acc;
  }, {});
};

export const findLowestRateCallback = (accumulator, currentValue) =>
  Math.min(
    accumulator.rate ? accumulator.rate : accumulator,
    currentValue.rate
  );

export const filterStoresByRateAndDistanceCallback = store =>
  store.rate && store.distance <= process.env.PHX_DISTANCE_FILTER;

export const generateDynamicPageTitle = (lowestRate, titleTag) => {
  let dynamicPageTitle;

  if (lowestRate) {
    titleTag.includes("#LowestPrice#")
      ? (dynamicPageTitle = titleTag.replace("#LowestPrice#", `$${lowestRate}`))
      : (dynamicPageTitle = titleTag);
  }

  if (!lowestRate) {
    titleTag.includes("#LowestPrice#")
      ? (dynamicPageTitle = titleTag.replace("#LowestPrice#", ""))
      : (dynamicPageTitle = titleTag);
  }

  return dynamicPageTitle;
};

export const replaceDynamicTextFromContentString = (
  textToReplace,
  completeContentText,
  newValue
) => {
  return completeContentText.includes(textToReplace)
    ? completeContentText.replace(textToReplace, newValue)
    : completeContentText;
};

export const convertSecondsToMinutesFormat = seconds => {
  try {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  } catch {
    return "00:00";
  }
};

export const calculateSitemapContentfulLimit = numberOfCities => {
  return Math.ceil(numberOfCities * 0.25);
};

export const calculateSitemapContentfulSkip = (page = 0, limit) => {
  return page * limit;
};
export const formatNegativeCurrencyAmount = negativeAmount => {
  return `-$${negativeAmount.toFixed(2).replace("-", "")}`;
};

export const getOrdinalDay = day => {
  let sufix = null;
  if (day > 3 && day < 21) {
    sufix = "th";
  } else {
    switch (day % 10) {
      case 1:
        sufix = "st";
        break;
      case 2:
        sufix = "nd";
        break;
      case 3:
        sufix = "rd";
        break;
      default:
        sufix = "th";
        break;
    }
  }

  return `${day}${sufix}`;
};

export const redirectOnBackButton = url => {
  const router = useRouter();
  router.beforePopState(() => {
    window.location.href = url;
  });
};

const bigObject = [
  {
    "_id": "60d0dacc0eecfb8660307997",
    "index": 0,
    "guid": "51bcfb30-e609-4068-8574-6b3f3bf8666a",
    "isActive": false,
    "balance": "$1,658.74",
    "picture": "http://placehold.it/32x32",
    "age": 31,
    "eyeColor": "brown",
    "name": "Flores Hoffman",
    "gender": "male",
    "company": "RUBADUB",
    "email": "floreshoffman@rubadub.com",
    "phone": "+1 (850) 423-3090",
    "address": "409 Brightwater Court, National, Maryland, 2467",
    "about": "Commodo Lorem exercitation velit occaecat elit sunt nulla magna elit cupidatat non occaecat fugiat incididunt. Lorem eiusmod velit laboris laborum elit aliquip labore aliqua officia nulla tempor Lorem. Ex consequat pariatur in ullamco ut aute duis officia. Dolor reprehenderit culpa aute nisi dolore quis ullamco aliquip minim. Reprehenderit elit esse cillum ad enim fugiat eiusmod quis tempor cillum culpa est occaecat laborum. Sit nostrud fugiat est cillum occaecat ad exercitation voluptate in ad cillum ipsum dolor Lorem.\r\n",
    "registered": "2015-06-14T05:58:16 +06:00",
    "latitude": 74.759999,
    "longitude": -162.328499,
    "tags": [
      "cupidatat",
      "sint",
      "excepteur",
      "velit",
      "nisi",
      "non",
      "ut"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Alba Padilla"
      },
      {
        "id": 1,
        "name": "Mccarty Harrison"
      },
      {
        "id": 2,
        "name": "Mccarthy Holcomb"
      }
    ],
    "greeting": "Hello, Flores Hoffman! You have 2 unread messages.",
    "favoriteFruit": "strawberry"
  },
  {
    "_id": "60d0dacc2570e344ad1bcefe",
    "index": 1,
    "guid": "6c892df6-3b18-4405-92ee-b92a99b32dc2",
    "isActive": true,
    "balance": "$1,742.62",
    "picture": "http://placehold.it/32x32",
    "age": 21,
    "eyeColor": "green",
    "name": "Blackburn Lynn",
    "gender": "male",
    "company": "PYRAMIA",
    "email": "blackburnlynn@pyramia.com",
    "phone": "+1 (850) 558-3264",
    "address": "120 Colby Court, Veyo, New Mexico, 1900",
    "about": "Irure minim ipsum sint deserunt laborum laboris. Laborum laborum anim aute sunt nostrud elit in. Dolor tempor ea aliqua officia labore anim laboris minim amet consectetur nisi. Qui labore aute do eiusmod elit aute excepteur ea quis proident ad ea laborum cupidatat.\r\n",
    "registered": "2014-10-10T09:33:22 +06:00",
    "latitude": 59.085953,
    "longitude": 40.570506,
    "tags": [
      "incididunt",
      "voluptate",
      "magna",
      "eiusmod",
      "deserunt",
      "labore",
      "ut"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Kimberley Trujillo"
      },
      {
        "id": 1,
        "name": "Louisa Stein"
      },
      {
        "id": 2,
        "name": "Lois Allen"
      }
    ],
    "greeting": "Hello, Blackburn Lynn! You have 4 unread messages.",
    "favoriteFruit": "strawberry"
  },
  {
    "_id": "60d0dacca55cb862e20b3588",
    "index": 2,
    "guid": "28c7bf22-09ba-4a8a-9a1f-e8c503297db8",
    "isActive": true,
    "balance": "$3,417.38",
    "picture": "http://placehold.it/32x32",
    "age": 24,
    "eyeColor": "blue",
    "name": "Stuart Estrada",
    "gender": "male",
    "company": "OPTYK",
    "email": "stuartestrada@optyk.com",
    "phone": "+1 (821) 537-3596",
    "address": "169 Halleck Street, Cliff, Louisiana, 2791",
    "about": "Irure magna cupidatat consequat nostrud elit. Fugiat sint ea aute ipsum amet enim et veniam reprehenderit incididunt reprehenderit ex. Ad nisi aute nisi laborum ipsum excepteur duis occaecat incididunt sunt. Excepteur anim nostrud id velit aliquip qui elit adipisicing nostrud anim excepteur sint voluptate dolore. Sint non commodo id in magna tempor.\r\n",
    "registered": "2014-05-14T01:20:01 +06:00",
    "latitude": 1.112202,
    "longitude": -2.466004,
    "tags": [
      "do",
      "fugiat",
      "exercitation",
      "anim",
      "eiusmod",
      "labore",
      "qui"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Francis Suarez"
      },
      {
        "id": 1,
        "name": "Atkinson Floyd"
      },
      {
        "id": 2,
        "name": "Sofia Sherman"
      }
    ],
    "greeting": "Hello, Stuart Estrada! You have 1 unread messages.",
    "favoriteFruit": "strawberry"
  },
  {
    "_id": "60d0daccdb9d71e188088bd8",
    "index": 3,
    "guid": "e2fd462f-179d-4968-b83c-a14073c2ec3c",
    "isActive": true,
    "balance": "$3,326.79",
    "picture": "http://placehold.it/32x32",
    "age": 26,
    "eyeColor": "brown",
    "name": "Dorsey Graves",
    "gender": "male",
    "company": "MOREGANIC",
    "email": "dorseygraves@moreganic.com",
    "phone": "+1 (916) 584-2477",
    "address": "968 Brevoort Place, Gila, Mississippi, 2440",
    "about": "Elit amet nostrud exercitation irure labore do dolore cupidatat aliqua aliquip aliqua. Est Lorem veniam quis sunt irure magna commodo commodo esse elit ut labore elit. Aliqua sunt commodo deserunt aliquip do consectetur minim veniam sit enim velit incididunt enim duis. Eu est laborum aliquip cillum magna excepteur voluptate enim cupidatat. Commodo consectetur ad occaecat ad. Voluptate laborum ea elit mollit dolore excepteur reprehenderit amet deserunt ullamco. Mollit voluptate sint exercitation exercitation fugiat elit aliquip id.\r\n",
    "registered": "2015-04-26T06:57:05 +06:00",
    "latitude": -33.471931,
    "longitude": 100.897696,
    "tags": [
      "sit",
      "est",
      "magna",
      "ipsum",
      "quis",
      "eu",
      "est"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Mitzi Sykes"
      },
      {
        "id": 1,
        "name": "Terry Soto"
      },
      {
        "id": 2,
        "name": "Leticia Blankenship"
      }
    ],
    "greeting": "Hello, Dorsey Graves! You have 10 unread messages.",
    "favoriteFruit": "banana"
  },
  {
    "_id": "60d0daccc606f3cda020964d",
    "index": 4,
    "guid": "e829d875-127f-4ad4-bd12-6ead1ffef3de",
    "isActive": true,
    "balance": "$2,923.01",
    "picture": "http://placehold.it/32x32",
    "age": 26,
    "eyeColor": "green",
    "name": "Day Crane",
    "gender": "male",
    "company": "EARBANG",
    "email": "daycrane@earbang.com",
    "phone": "+1 (892) 503-3707",
    "address": "218 Harkness Avenue, Thermal, Nebraska, 3623",
    "about": "Et nulla pariatur qui ut reprehenderit eu nostrud aliquip tempor enim sint et irure non. Qui aliqua eu minim in. Voluptate velit commodo nostrud elit aliqua. Eu anim ex nostrud sunt proident id Lorem excepteur duis voluptate.\r\n",
    "registered": "2019-08-28T12:02:31 +06:00",
    "latitude": 83.866814,
    "longitude": -135.757107,
    "tags": [
      "reprehenderit",
      "laborum",
      "adipisicing",
      "anim",
      "amet",
      "anim",
      "laboris"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Adele Armstrong"
      },
      {
        "id": 1,
        "name": "Cervantes Mclean"
      },
      {
        "id": 2,
        "name": "Mack Gonzalez"
      }
    ],
    "greeting": "Hello, Day Crane! You have 2 unread messages.",
    "favoriteFruit": "apple"
  },
  
    {
      "_id": "60d0dacc0eecfb8660307997",
      "index": 0,
      "guid": "51bcfb30-e609-4068-8574-6b3f3bf8666a",
      "isActive": false,
      "balance": "$1,658.74",
      "picture": "http://placehold.it/32x32",
      "age": 31,
      "eyeColor": "brown",
      "name": "Flores Hoffman",
      "gender": "male",
      "company": "RUBADUB",
      "email": "floreshoffman@rubadub.com",
      "phone": "+1 (850) 423-3090",
      "address": "409 Brightwater Court, National, Maryland, 2467",
      "about": "Commodo Lorem exercitation velit occaecat elit sunt nulla magna elit cupidatat non occaecat fugiat incididunt. Lorem eiusmod velit laboris laborum elit aliquip labore aliqua officia nulla tempor Lorem. Ex consequat pariatur in ullamco ut aute duis officia. Dolor reprehenderit culpa aute nisi dolore quis ullamco aliquip minim. Reprehenderit elit esse cillum ad enim fugiat eiusmod quis tempor cillum culpa est occaecat laborum. Sit nostrud fugiat est cillum occaecat ad exercitation voluptate in ad cillum ipsum dolor Lorem.\r\n",
      "registered": "2015-06-14T05:58:16 +06:00",
      "latitude": 74.759999,
      "longitude": -162.328499,
      "tags": [
        "cupidatat",
        "sint",
        "excepteur",
        "velit",
        "nisi",
        "non",
        "ut"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Alba Padilla"
        },
        {
          "id": 1,
          "name": "Mccarty Harrison"
        },
        {
          "id": 2,
          "name": "Mccarthy Holcomb"
        }
      ],
      "greeting": "Hello, Flores Hoffman! You have 2 unread messages.",
      "favoriteFruit": "strawberry"
    },
    {
      "_id": "60d0dacc2570e344ad1bcefe",
      "index": 1,
      "guid": "6c892df6-3b18-4405-92ee-b92a99b32dc2",
      "isActive": true,
      "balance": "$1,742.62",
      "picture": "http://placehold.it/32x32",
      "age": 21,
      "eyeColor": "green",
      "name": "Blackburn Lynn",
      "gender": "male",
      "company": "PYRAMIA",
      "email": "blackburnlynn@pyramia.com",
      "phone": "+1 (850) 558-3264",
      "address": "120 Colby Court, Veyo, New Mexico, 1900",
      "about": "Irure minim ipsum sint deserunt laborum laboris. Laborum laborum anim aute sunt nostrud elit in. Dolor tempor ea aliqua officia labore anim laboris minim amet consectetur nisi. Qui labore aute do eiusmod elit aute excepteur ea quis proident ad ea laborum cupidatat.\r\n",
      "registered": "2014-10-10T09:33:22 +06:00",
      "latitude": 59.085953,
      "longitude": 40.570506,
      "tags": [
        "incididunt",
        "voluptate",
        "magna",
        "eiusmod",
        "deserunt",
        "labore",
        "ut"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Kimberley Trujillo"
        },
        {
          "id": 1,
          "name": "Louisa Stein"
        },
        {
          "id": 2,
          "name": "Lois Allen"
        }
      ],
      "greeting": "Hello, Blackburn Lynn! You have 4 unread messages.",
      "favoriteFruit": "strawberry"
    },
    {
      "_id": "60d0dacca55cb862e20b3588",
      "index": 2,
      "guid": "28c7bf22-09ba-4a8a-9a1f-e8c503297db8",
      "isActive": true,
      "balance": "$3,417.38",
      "picture": "http://placehold.it/32x32",
      "age": 24,
      "eyeColor": "blue",
      "name": "Stuart Estrada",
      "gender": "male",
      "company": "OPTYK",
      "email": "stuartestrada@optyk.com",
      "phone": "+1 (821) 537-3596",
      "address": "169 Halleck Street, Cliff, Louisiana, 2791",
      "about": "Irure magna cupidatat consequat nostrud elit. Fugiat sint ea aute ipsum amet enim et veniam reprehenderit incididunt reprehenderit ex. Ad nisi aute nisi laborum ipsum excepteur duis occaecat incididunt sunt. Excepteur anim nostrud id velit aliquip qui elit adipisicing nostrud anim excepteur sint voluptate dolore. Sint non commodo id in magna tempor.\r\n",
      "registered": "2014-05-14T01:20:01 +06:00",
      "latitude": 1.112202,
      "longitude": -2.466004,
      "tags": [
        "do",
        "fugiat",
        "exercitation",
        "anim",
        "eiusmod",
        "labore",
        "qui"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Francis Suarez"
        },
        {
          "id": 1,
          "name": "Atkinson Floyd"
        },
        {
          "id": 2,
          "name": "Sofia Sherman"
        }
      ],
      "greeting": "Hello, Stuart Estrada! You have 1 unread messages.",
      "favoriteFruit": "strawberry"
    },
    {
      "_id": "60d0daccdb9d71e188088bd8",
      "index": 3,
      "guid": "e2fd462f-179d-4968-b83c-a14073c2ec3c",
      "isActive": true,
      "balance": "$3,326.79",
      "picture": "http://placehold.it/32x32",
      "age": 26,
      "eyeColor": "brown",
      "name": "Dorsey Graves",
      "gender": "male",
      "company": "MOREGANIC",
      "email": "dorseygraves@moreganic.com",
      "phone": "+1 (916) 584-2477",
      "address": "968 Brevoort Place, Gila, Mississippi, 2440",
      "about": "Elit amet nostrud exercitation irure labore do dolore cupidatat aliqua aliquip aliqua. Est Lorem veniam quis sunt irure magna commodo commodo esse elit ut labore elit. Aliqua sunt commodo deserunt aliquip do consectetur minim veniam sit enim velit incididunt enim duis. Eu est laborum aliquip cillum magna excepteur voluptate enim cupidatat. Commodo consectetur ad occaecat ad. Voluptate laborum ea elit mollit dolore excepteur reprehenderit amet deserunt ullamco. Mollit voluptate sint exercitation exercitation fugiat elit aliquip id.\r\n",
      "registered": "2015-04-26T06:57:05 +06:00",
      "latitude": -33.471931,
      "longitude": 100.897696,
      "tags": [
        "sit",
        "est",
        "magna",
        "ipsum",
        "quis",
        "eu",
        "est"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Mitzi Sykes"
        },
        {
          "id": 1,
          "name": "Terry Soto"
        },
        {
          "id": 2,
          "name": "Leticia Blankenship"
        }
      ],
      "greeting": "Hello, Dorsey Graves! You have 10 unread messages.",
      "favoriteFruit": "banana"
    },
    {
      "_id": "60d0daccc606f3cda020964d",
      "index": 4,
      "guid": "e829d875-127f-4ad4-bd12-6ead1ffef3de",
      "isActive": true,
      "balance": "$2,923.01",
      "picture": "http://placehold.it/32x32",
      "age": 26,
      "eyeColor": "green",
      "name": "Day Crane",
      "gender": "male",
      "company": "EARBANG",
      "email": "daycrane@earbang.com",
      "phone": "+1 (892) 503-3707",
      "address": "218 Harkness Avenue, Thermal, Nebraska, 3623",
      "about": "Et nulla pariatur qui ut reprehenderit eu nostrud aliquip tempor enim sint et irure non. Qui aliqua eu minim in. Voluptate velit commodo nostrud elit aliqua. Eu anim ex nostrud sunt proident id Lorem excepteur duis voluptate.\r\n",
      "registered": "2019-08-28T12:02:31 +06:00",
      "latitude": 83.866814,
      "longitude": -135.757107,
      "tags": [
        "reprehenderit",
        "laborum",
        "adipisicing",
        "anim",
        "amet",
        "anim",
        "laboris"
      ],
      "friends": [
        {
          "id": 0,
          "name": "Adele Armstrong"
        },
        {
          "id": 1,
          "name": "Cervantes Mclean"
        },
        {
          "id": 2,
          "name": "Mack Gonzalez"
        }
      ],
      "greeting": "Hello, Day Crane! You have 2 unread messages.",
      "favoriteFruit": "apple"
    }
  
];