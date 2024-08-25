import { getRouteUsage } from "../e2e/utils";

after(() => {
	console.log(getRouteUsage());
});
