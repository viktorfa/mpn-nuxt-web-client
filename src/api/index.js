import fetch from "node-fetch";

import { getJsonFetchOption, getFullFileUrl, optionFetch } from "./util";
import cache from "./cache";
import { strapiUrl, apiUrl, productCollection } from "~/config/vars";

export const getAutocompleteData = async () => {
  const fileName = "autocomplete-data-latest.json";
  const response = await fetch(getFullFileUrl(fileName));
  return getJsonFetchOption(response);
};

export const getGroceryOffer = async (uri) => {
  const { data, error } = await optionFetch(
    `${strapiUrl}/${productCollection}?uri=${uri}&_limit=1`,
  );
  if (data && data[0]) {
    return {
      ok: true,
      data: data[0],
    };
  } else {
    return {
      ok: false,
      error,
    };
  }
};

export const getPromotedOffers = async (offerLimit = 30) => {
  const earliestToday = new Date();
  earliestToday.setUTCMilliseconds(0);
  earliestToday.setUTCSeconds(0);
  earliestToday.setUTCMinutes(0);
  earliestToday.setUTCHours(0);
  const latestToday = new Date();
  latestToday.setUTCMilliseconds(999);
  latestToday.setUTCSeconds(59);
  latestToday.setUTCMinutes(59);
  latestToday.setUTCHours(23);

  const strapiUrlParameterString = `run_till_gt=${earliestToday.toISOString()}&run_from_lt=${latestToday.toISOString()}&_limit=${offerLimit}&_sort=is_promoted:DESC`;
  const response = await fetch(
    `${strapiUrl}/${productCollection}?${strapiUrlParameterString}`,
  );
  return getJsonFetchOption(response);
};

export const searchGroceryOffers = async (query) => {
  const cachedResponse = cache.get(query.toLowerCase());
  if (cachedResponse) {
    console.log("using cache");
    return cachedResponse;
  }
  const url = `${strapiUrl}/${productCollection}?heading_contains=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const fetchOption = await getJsonFetchOption(response);
  cache.set(query.toLowerCase(), fetchOption);
  return fetchOption;
};
