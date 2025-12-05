export async function my_request_get(link: string) {
    try {
        const response = await fetch(link,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("ERROR GET");
        }
        let data = await response.json();
        let dataResponse = data.resultList;
        return dataResponse;
    } catch (error) {
        console.log(error);
    }
}

export async function my_request_post(link: string, dataForm: any) {
    try {
        const response = await fetch(link,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataForm)
            }
        );
        if (!response.ok) {
            throw new Error("ERROR POST");
        }
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.log(error);
    }
}

export async function my_request_put(link: string, dataForm: any) {
    try {
        const response = await fetch(link,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(dataForm)
            }
        );
        if (!response.ok) {
            throw new Error("ERROR PUT");
        }
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.log(error);
    }
}

export async function my_request_delete(link: string) {
    try {
        const response = await fetch(link,
            {
                method: "DELETE",
            }
        );
        if (!response.ok) {
            throw new Error("ERROR DELETE");
        }
        return;
    } catch (error) {
        console.log(error);
    }
}