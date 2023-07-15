//src/api.tsx
import axios from "axios";
import {
  CompanyBalanceSheet,
  CompanyCashFlow,
  CompanyCompData,
  CompanyIncomeStatement,
  CompanyKeyMetrics,
  CompanyKeyRatios,
  CompanyProfile,
  CompanySearch,
  CompanyTenK,
  CompanyHistoricalDividend,
  Dividend,
} from "./company";

export interface SearchResponse {
  data: CompanySearch[];
}

// Updated to use the stable API
export const searchCompanies = async (query: string, limit: number = 50, exchange?: string) => {
  try {
    const exchangeParam = exchange ? `&exchange=${exchange}` : '';
    const data = await axios.get<CompanySearch[]>(
      `https://financialmodelingprep.com/stable/search-symbol?query=${query}&limit=${limit}${exchangeParam}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An expected error has occurred.";
    }
  }
};

// Updated to use stable version - now returns array directly instead of wrapping in data property
export const getCompanyProfile = async (query: string) => {
  try {
    const data = await axios.get<CompanyProfile[]>(
      `https://financialmodelingprep.com/stable/profile?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Updated to use stable version
export const getKeyMetrics = async (query: string) => {
  try {
    const data = await axios.get<CompanyKeyMetrics[]>(
      `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching key metrics:", error.message);
    throw error;
  }
};

// New function for financial ratios TTM (stable API)
export const getKeyRatios = async (query: string) => {
  try {
    const data = await axios.get<CompanyKeyRatios[]>(
      `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching key ratios:", error.message);
    throw error;
  }
};

// Updated to use stable version
export const getIncomeStatement = async (query: string, limit: number = 50, period?: string) => {
  try {
    const periodParam = period ? `&period=${period}` : '';
    const data = await axios.get<CompanyIncomeStatement[]>(
      `https://financialmodelingprep.com/stable/income-statement?symbol=${query}&limit=${limit}${periodParam}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Updated to use stable version
export const getBalanceSheet = async (query: string, limit: number = 20, period?: string) => {
  try {
    const periodParam = period ? `&period=${period}` : '';
    const data = await axios.get<CompanyBalanceSheet[]>(
      `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${query}&limit=${limit}${periodParam}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Updated to use stable version
export const getCashFlow = async (query: string, limit: number = 100, period?: string) => {
  try {
    const periodParam = period ? `&period=${period}` : '';
    const data = await axios.get<CompanyCashFlow[]>(
      `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${query}&limit=${limit}${periodParam}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Updated to use stable version - Stock peers
export const getCompData = async (query: string) => {
  try {
    const data = await axios.get<CompanyCompData[]>(
      `https://financialmodelingprep.com/stable/stock-peers?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Updated to use stable version - SEC filings by symbol
export const getTenK = async (query: string, from?: string, to?: string, page: number = 0, limit: number = 100) => {
  try {
    const fromParam = from || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to 1 year ago
    const toParam = to || new Date().toISOString().split('T')[0]; // Default to today
    
    const data = await axios.get<CompanyTenK[]>(
      `https://financialmodelingprep.com/stable/sec-filings-search/symbol?symbol=${query}&from=${fromParam}&to=${toParam}&page=${page}&limit=${limit}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Updated to use stable version for historical dividends
export const getHistoricalDividend = async (query: string) => {
  try {
    const data = await axios.get<CompanyHistoricalDividend>(
      `https://financialmodelingprep.com/stable/dividends?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Additional stable API functions you might want to add:

// Get company quote
export const getCompanyQuote = async (query: string) => {
  try {
    const data = await axios.get(
      `https://financialmodelingprep.com/stable/quote?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Get historical price data (light version)
export const getHistoricalPriceLight = async (query: string, from?: string, to?: string) => {
  try {
    const params = new URLSearchParams({
      symbol: query,
      apikey: process.env.REACT_APP_API_KEY!
    });
    
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const data = await axios.get(
      `https://financialmodelingprep.com/stable/historical-price-eod/light?${params.toString()}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};

// Get earnings calendar for a company
export const getEarningsCalendar = async (query: string, from?: string, to?: string) => {
  try {
    const params = new URLSearchParams({
      apikey: process.env.REACT_APP_API_KEY!
    });
    
    if (query) params.append('symbol', query);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const data = await axios.get(
      `https://financialmodelingprep.com/stable/earnings-calendar?${params.toString()}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
    throw error;
  }
};