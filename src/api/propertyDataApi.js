function PropertyDataApi () {

    const getUrl = (absolutePath) => {
        return `${process.env.REACT_APP_API_URL}${absolutePath}`;
    }

    /**
     * 
     * @param {*} response 
     * @returns 
     */
    this.handleException = (response) => {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
    }

    /**
     * 
     * @returns 
     */
    this.getAll = async () => {
        const response = await fetch(getUrl(`/property-data`));
        if (!response.ok) return this.handleException(response);
        return await response.json();
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    this.getById = async (id) => {
        const response = await fetch(getUrl(`/property-data/${id}`));
        if (!response.ok) return this.handleException(response);
        return await response.json();
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    this.delete = async (id) => {
        const response = await fetch(getUrl(`/property-data/${id}`), {
            method: "DELETE"
        });

        if (!response.ok) return this.handleException(response);
        return await response.json();
    }
}

export const propertyDataApi = new PropertyDataApi();