import axios from 'axios'

const axiosResponse = async (response) => {
    if (response.status >= 200 && response.status < 300) {
        return !response.data.items ? { status: response.status, message: response.message, data: response.data } : { status: response.data.status, message: response.data.message, data: response.data.items }
    }
    else {
        return { status: response.status, message: response.message, data: {} }
    }
}

const POST = async (endpoint, bodyData, headers) => {
    let config = {
        method: 'POST',
        url: endpoint,
        headers: {
            'Content-Type': 'application/json'
        },
        data: bodyData

    }

    if (headers) {
        Object.assign(config.headers, headers);
    }

    try {
        const response = await axios(config);
        return axiosResponse(response);
    } catch (error) {
        console.log(error)
        return axiosResponse(error)
    }
}


const GET = async (endpoint, headers) => {

    let config = {
        method: 'GET',
        url: endpoint,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (headers) {
        Object.assign(config.headers, headers);
    }

    try {
        const response = await axios(config);
        return axiosResponse(response);
    } catch (error) {
        console.log(error);
        return axiosResponse(error);
    }
}


export {
    POST,
    GET
}