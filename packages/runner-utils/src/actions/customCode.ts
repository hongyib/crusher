import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { ExportsManager } from "../functions/exports";
import { StorageManager } from "../functions/storage";
import { CrusherSdk } from "../sdk/sdk";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import template from "@crusher-shared/utils/templateString";
import expect from "expect";
import * as modules from "../utils/modules";
import { CommunicationChannel } from "../functions/communicationChannel";
import * as util from "@babel/cli/lib/babel/util";

async function executeCustomCode(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communcationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
) {
	const customScriptFunction = action.payload.meta.script;

	const crusherSdk = sdk ? sdk : new CrusherSdk(page, exportsManager, storageManager, communcationChannel);

	let result = null;

	const res = await util.transformRepl("main.js", customScriptFunction, {
		plugins: [
			require("@babel/plugin-transform-typescript"), require("babel-plugin-auto-await/index"),
			function(babel) {			  
				return {
				  visitor: {
			  ExpressionStatement: function (path) {
				if(!["LogicalExpression", "BinaryExpression"].includes(path.node.expression.type)) return;
				path.replaceWith(babel.types.ifStatement(
				  babel.types.UnaryExpression("!", path.node.expression),
				  babel.types.ThrowStatement(babel.types.callExpression(babel.types.identifier("Error"), [babel.types.StringLiteral("Error")]))
				));
					}
				  }
				}
			}
		]
	  });

	result = await new Function(
		"exports",
		"require",
		"module",
		"__filename",
		"__dirname",
		"crusherSdk",
		"ctx",
		"expect",
		"modules",
		`${res.code} if(typeof validate === "function") { return validate(crusherSdk, ctx); } return true;`,
	)(
		exports,
		//@ts-ignore
		typeof __webpack_require__ === "function" ? __non_webpack_require__ : require,
		module,
		__filename,
		__dirname,
		crusherSdk,
		context,
		expect,
		modules,
	);

	return {
		customLogMessage: result ? "Executed custom code" : "Error executing custom code",
		result: result,
		outputs: result && result.outputs ? result.outputs : [],
	};
}

module.exports = {
	name: ActionsInTestEnum.CUSTOM_CODE,
	description: "Executing custom code",
	actionDescriber: (action: iAction) => {
		return `Run custom code`;
	},
	handler: executeCustomCode,
};
