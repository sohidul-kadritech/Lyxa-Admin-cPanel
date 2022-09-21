export const callApi = async (sId, api, type, route) => {
    const { data } = await requestApi().request(api, {
        params: {
            id: sId,
        },
    });

    if (data.status) {
        return data.data[type];
    } else {
        history.push(`${route}`, { replace: true });
    }
};