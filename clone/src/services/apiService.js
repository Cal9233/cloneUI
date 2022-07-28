import * as axios from "axios";
import config from '../utils/config';
import axiosCancel from 'axios-cancel';

axiosCancel(axios, {
  debug: false // default
});

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default class Api {
  constructor(api_url, cancelToken) {
    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
      this.api_token = config.JWT.api_token;
    }
    else this.api_token = config.JWT.api_token_prod;
    //
    this.client = null;
    if (!api_url) {
      if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
        this.api_url = config.API_URL_DEV;
      }
      else this.api_url = config.API_URL_PROD;
    }
    else this.api_url = api_url;
    //this.cancelToken = undefined;
    //this.cancelToken = cancelToken ? cancelToken : undefined;   

  }

  init = () => {
    let headers = {
      Accept: "application/json",
    };

    if (this.api_token) {
      headers.Authorization = `${this.api_token}`;
    }

    this.client = axios.create({
      baseURL: this.api_url,
      //timeout: 31000,
      headers: headers,
    });

    return this.client;
  };

  /* Runs */
  deleteRun = (id) => {
    return this.init().delete(`/runs/${id}`);
  };
  getRunsList = () => {
    //if (typeof this.cancelToken != typeof undefined) {
    //  this.cancelToken.cancel("Operation canceled due to new request.");
    // }
    // this.cancelToken = axios.CancelToken.source();
    //console.log(this.cancelToken);
    return this.init().get("/runs"/*{ cancelToken: this.cancelToken.token }*/);
  };
  getRunsByLibPool = (id) => {
    return this.init().get(`/runs/libpool/${id}`);
  };
  getRunsBySamplePlate = (id) => {
    return this.init().get(`/runs/all/sampleplate/${id}`);
  };
  getRunsBySeqTube = (id) => {
    return this.init().get(`/runs/all/seqtube/${id}`);
  };
  putRunsList = (data) => {
    var runId = data.runId;
    return this.init().put(`/runs/${runId}`, data);
  };
  postRunsList = (data) => {
    var runId = data.runId;
    return this.init().post(`/runs/${runId}`, data);
  };
  deleteRunsList = (params) => {
    var runId = params.runId;
    return this.init().delete(`/runs/${runId}`);
  };
  getSamplesList = (params) => {
    return this.init().get("/samples", { params: params });
  };

  /* Library_Pools */
  getLibraryIndexesByLibraryPool = (id) => {
    return this.init().get(`/libraries/${id}`);
  };

  /* Libraries */
  /* = (params) => {
    return this.init().get("/libraries", { params: params });
  };
  getLibraryListByIds = (params) => {
    return this.init().get(`/libraries/${params}`);
  };
  getLibraryBarcodeList = (params) => {
    return this.init().get("/libraries/barcode", { params: params });
  };*/
  /*getLibraryBarcodeListById = (params) => {
    var ids = params.libraryIds;
    var versions = params.libraryVersions;
    var sampleId = params.lIMS_Sample;
    return this.init().get(`/libraries/barcode/${ids}/${versions}/${sampleId}`);
  };*/
  /*getLibrarySampleList = (params) => {
    return this.init().get("/libraries/sample", { params: params });
  };
  putLibraryList = (data) => {
    var id = data.id;
    return this.init().put(`/libraries/${id}`, data);
  };
  postLibraryList = (data) => {
    return this.init().post(`/libraries`, data);
  };
  deleteLibraryList = (params) => {
    var specimen = params.specimen;
    var version = params.version;
    return this.init().delete(`/libraries/${specimen}/${version}`);
  };  */

  /*getAllDataBySamplePlate = (id) => {    
    return this.init().get(`/runs/sampleplate/${id}`);
  };*/

  /* Samples */
  getSampleList = (params) => {
    return this.init().get("/samples", { params: params });
  };
  getSampleRecipesList = (params) => {
    return this.init().get("/samples/recipes", { params: params });
  };
  getSampleLibraryList = (params) => {
    return this.init().get("/samples/library", { params: params });
  };
  putSampleList = (data) => {
    var id = data.id;
    return this.init().put(`/samples/${id}`, data);
  };
  postSampleList = (data) => {
    //var id = data.id;
    return this.init().post(`/samples`, data);
  };
  deleteSampleList = (params) => {
    var id = params.lIMS_Sample;
    return this.init().delete(`/samples/${id}`);
  };

  /* Sequencing Recipes */
  getSequencingRecipeList = (params) => {
    return this.init().get("/sequencingrecipes", { params: params });
  };
  putSequencingRecipeList = (data) => {
    var id = data.id;
    return this.init().put(`/sequencingrecipes/${id}`, data);
  };
  postSequencingRecipeList = (data) => {
    //var id = data.id;
    return this.init().post(`/sequencingrecipes`, data);
  };
  deleteSequencingRecipeList = (params) => {
    var id = params.id;
    return this.init().delete(`/sequencingrecipes/${id}`);
  };

  /* Analysis Recipes */
  getAnalysisRecipeList = (params) => {
    return this.init().get("/analysisrecipes", { params: params });
  };
  putAnalysisRecipeList = (data) => {
    var id = data.id;
    return this.init().put(`/analysisrecipes/${id}`, data);
  };
  postAnalysisRecipeList = (data) => {
    //var id = data.id;
    return this.init().post(`/analysisrecipes`, data);
  };
  deleteAnalysisRecipeList = (params) => {
    var id = params.id;
    return this.init().delete(`/analysisrecipes/${id}`);
  };

  /* PYTHON */
  getSamplePairs = (id, cancelToken) => {
    /*if (cancelRequestIds) {
      cancelRequestIds.forEach(f => this.init().cancel(f));
    }  */
    if (cancelToken != undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    var cancelToken = axios.CancelToken.source();
    return this.init().get(`/data/${id}`, { cancelToken: cancelToken.token });
  };

  postLibraryAllData = (data) => {
    return this.init().post(`/postlibraryalldata`, data);
  };

  putLibraryAllData = (data) => {
    console.log("api data: ", data);
    return this.init().post(`/putlibraryalldata`, data);
  };


  /* Settings */
  postSettings = (path1, path2, path3, modeAMP1, modeAMP2) => {
    var data = [{ 'paramname': 'Path1', 'value': path1 }, { 'paramname': 'Path2', 'value': path2 }, { 'paramname': 'Path3', 'value': path3 },
    { 'paramname': 'modeAMP1', 'value': modeAMP1 }, { 'paramname': 'modeAMP2', 'value': modeAMP2 }];
    return this.init().post(`/settings/`, data);
  };
  getSettings = () => {
    return this.init().get(`/settings/`);
  };

  checkFileExists = (path) => {
    var data = { 'filePath': path };
    return this.init().post(`/fileexists/`, data);
  };

  checkDirExists = (path) => {
    var data = { 'filePath': path };
    return this.init().post(`/direxists/`, data);
  };

  getAPIDocs = () => {
    return this.init().get(`/api-docs/`);
  };

  /* Search */
  searchData = (data) => {
    return this.init().post(`/sequencer/search`, data);
  };
}