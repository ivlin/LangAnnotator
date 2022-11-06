import { v4 } from "uuid";

export const getAnnotationKey = function() {
	return v4();
};

export const getContentItemKey = function() {
	return v4();
};