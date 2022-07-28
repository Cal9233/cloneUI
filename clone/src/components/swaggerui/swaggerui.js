import React, { Component } from 'react';
import SwaggerUi, { presets } from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import Api from "../../services/apiService";
import config from '../../utils/config';
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom';
import NewWindow from 'react-new-window';

const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)

class Swagger extends Component {
    constructor(props) {
        super(props);
        this.state = { rawHTML: null };
    }

    componentDidMount() {
        var url;
        if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
            url = config.API_DOCS_URL_DEV;
        }
        else url = config.API_DOCS_URL_PROD;
        const api = new Api(url);
        api
            .getAPIDocs()
            .then((response) => {
                console.log(response.data);
                this.setState({
                    rawHTML: response.data
                  });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <NewWindow>
                 {this.state.rawHTML}
            </NewWindow>
        );
    }
}

export default Swagger;