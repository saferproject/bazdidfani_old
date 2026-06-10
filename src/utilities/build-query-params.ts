export default (params: Record<string, string | number | boolean>): string => {
	return Object.entries(params)
		.filter(([_key, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join("&");
};
