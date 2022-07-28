import config from '../utils/config';
import * as axios from "axios";

const getJwtToken = (env) => {
    var api_token = null;
    if (env === undefined || env === 'development') {
        api_token = config.JWT.api_token;
    }
    else api_token = config.JWT.api_token_prod;

    return api_token;
}

const getAPIUrl = (env) => {
    var api_url = null;
    if (env === undefined || env === 'development') {
        api_url = config.API_URL_DEV;
    }
    else api_url = config.API_URL_PROD;

    return api_url;
}

const getAPIUrl_User_Plugin = (env) => {
    var api_url = null;
    if (env === undefined || env === 'development') {
        api_url = config.API_URL_USER_PLUGIN_DEV;
    }
    else api_url = config.API_URL_USER_PLUGIN_TEST;

    return api_url;
}

const postData = async (url, data = {}) => {
    var api_url = getAPIUrl(process.env.NODE_ENV);
    const response = await fetch(`${api_url}${url}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getJwtToken(process.env.NODE_ENV)}`,
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

const postDataPromise = async (url, data = {}) => {
    var api_url = getAPIUrl(process.env.NODE_ENV);
    return fetch(`${api_url}${url}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getJwtToken(process.env.NODE_ENV)}`,
        },
        body: JSON.stringify(data)
    });
}

const uploadDataPromise = async (url, file = {}) => {
    let formData = new FormData();
    formData.append('file', file);
    var api_url = getAPIUrl(process.env.NODE_ENV);
    return fetch(`${api_url}${url}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            //'Content-Type': 'multipart/form-data',
            'Authorization': `${getJwtToken(process.env.NODE_ENV)}`,
        },
        body: formData
    });
}

const getData = async (url) => {
    var api_url = getAPIUrl(process.env.NODE_ENV);
    const response = await fetch(`${api_url}${url}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getJwtToken(process.env.NODE_ENV)}`,
        },
    });
    return response.json();
}

const getDataPromise = (url) => {
    var api_url = getAPIUrl(process.env.NODE_ENV);
    return fetch(`${api_url}${url}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getJwtToken(process.env.NODE_ENV)}`,
        },
    });
}

const putData = async (url, data = {}) => {
    var api_url = getAPIUrl(process.env.NODE_ENV);
    const response = await fetch(`${api_url}${url}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getJwtToken(process.env.NODE_ENV),
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

const deleteData = async (url) => {
    var api_url = getAPIUrl(process.env.NODE_ENV);
    const response = await fetch(`${api_url}${url}`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getJwtToken(process.env.NODE_ENV),
        },

    });
    return response.json();
}

export const deleteRun = async id => {
    return await deleteData(`/runs/${id}`);
};

export const getRunsByLibPool = async id => {
    return await getData(`/runs/libpool/${id}`);
};

export const getRunsBySamplePlate = async id => {
    return await getData(`/runs/all/sampleplate/${id}`);
};

export const getRunsBySeqTube = async id => {
    return await getData(`/runs/all/seqtube/${id}`);
};

export const getLibraryIndexesByLibraryPool = async id => {
    return await getData(`/libraries/${id}`);
};

export const getSequencingRecipeList = async () => {
    return await getData("/sequencingrecipes")
};

export const getAnalysisRecipeList = async () => {
    return await getData("/analysisrecipes");
};

export const getSequencingRecipeListActiveNotUsed = async () => {
    return await getData("/sequencingrecipe/status/activenotused")
};

export const getAnalysisRecipeListActiveNotUsed = async () => {
    return await getData("/analysisrecipe/status/activenotused");
};

export const getSamplePairs = async id => {
    return await getData(`/data/${id}`);
};

export const postLibraryAllData = async data => {
    return await postDataPromise(`/postlibraryalldata`, data);
};

export const putLibraryAllData = async data => {
    return await postDataPromise(`/putlibraryalldata`, data);
};

export const postSettings = async (path1, path2, path3, modeAMP2, prefix1, prefix2) => {
    var data = [{ 'paramname': 'Path1', 'value': path1 }, { 'paramname': 'Path2', 'value': path2 }, { 'paramname': 'Path3', 'value': path3 },
    { 'paramname': 'modeAMP2', 'value': modeAMP2 }, { 'paramname': 'Prefix1', 'value': prefix1 }, { 'paramname': 'Prefix2', 'value': prefix2 }];
    return await postDataPromise(`/settings/`, data);
};

export const getSettings = () => {
    return getDataPromise(`/settings/`);
};

export const checkFileExists = async path => {
    var data = { 'filePath': path };
    return postData(`/fileexists/`, data);
};

export const checkDirExists = async path => {
    var data = { 'filePath': path };
    return await postData(`/direxists/`, data);
};

export const getAPIDocs = async () => {
    return await getData(`/api-docs/`);
};

export const searchData = async data => {
    return await postDataPromise(`/sequencer/search`, data);
};

export const getVersion = async () => {
    var api_url = getAPIUrl_User_Plugin(process.env.NODE_ENV);
    const response = await fetch(`${api_url}/version/`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getJwtToken(process.env.NODE_ENV),
            //'Access-Control-Allow-Origin': `${api_url}`
        },
    });
    return response.json();
};

export const checkSequencingRecipeIsOld = async recipeName => {
    return await getDataPromise(`/sequncingrecipe/status/isold/${recipeName}`);
};

export const checkAnalysisRecipeIsOld = async recipeName => {
    return await getDataPromise(`/analysisrecipe/status/isold/${recipeName}`);
};

export const uploadSampleSheetFile = async file => {
    return await uploadDataPromise(`/data/upload`, file);
};

export const validateSampleSheet = (data) => {
    let api_token = getJwtToken(process.env.NODE_ENV);
    var api_url = getAPIUrl_User_Plugin(process.env.NODE_ENV);
    let headers = {
        Accept: "application/json",
    };

    if (api_token) {
        headers.Authorization = `${api_token}`;
    }
    let client = axios.create({
        baseURL: api_url,        
        headers: headers,
    });

    return client.post(`/validate`, data);
};