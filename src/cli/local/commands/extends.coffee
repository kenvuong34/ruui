fs = require("fs")
path = require("path")
chalk = require("chalk")
{ ruuiModule, localModule, ruuiCliModule, isDirectory, getDirectories, dotFilePath, templateExclusions } = require("../util/helper")
walk = require("../util/walk")
copyAndReplace = require("../util/copyAndReplace")
yarn = require("../util/yarn")

run = (argv, config, args) ->
	addon = args.addon
	addonPath = path.resolve(ruuiModule("cli", "addons"))
	localAddonPath = path.resolve(localModule("cli", "addons"))
	addonPath = localAddonPath if fs.existsSync(localAddonPath)
	availableAddons = getDirectories(addonPath)
		.map((source) -> path.relative(addonPath, source))
		.filter((name) -> name isnt "core")
	yarnVersion = yarn.getYarnVersionIfAvailable() and yarn.isProjectUsingYarn(process.cwd())
	templates = require("../util/templates")

	unless availableAddons.indexOf(addon) >= 0
		console.log(chalk.gray("failed to install, addon #{chalk.red(addon)} does not exists, available addons:"))
		console.log(chalk.green("[#{availableAddons.join(", ")}]"))
		return

	dependencies = {}; devDependencies = {}
	currentAddonPath = path.resolve(addonPath, addon)
	dependenciesPath = path.resolve(currentAddonPath, "dependencies.json")
	devDependenciesPath = path.resolve(currentAddonPath, "devDependencies.json")
	dependencies = Object.assign(dependencies, require(dependenciesPath)) if fs.existsSync(dependenciesPath)
	devDependencies = Object.assign(devDependencies, require(devDependenciesPath)) if fs.existsSync(devDependenciesPath)

	walk(currentAddonPath).forEach (absoluteSrcPath) ->
		relativeFilePath = path.relative(currentAddonPath, absoluteSrcPath)
		relativeRenamedPath = dotFilePath(relativeFilePath)
		absoluteDestinationPath = path.resolve(process.cwd(), relativeRenamedPath)

		return if templateExclusions.indexOf(relativeRenamedPath) >= 0
		copyAndReplace(absoluteSrcPath, absoluteDestinationPath, {})

	templates.installDependencies(dependencies, yarnVersion, false)
	templates.installDependencies(devDependencies, yarnVersion, true)

module.exports =
	name: "extends"
	description: "setup additional feature to current project"
	func: run
	examples: [
		desc: "install eslint (AirBnB) and dependencies"
		cmd: "ruui extends --addon eslint"
	],
	options: [
		command: "--addon [string]"
		description: "feature to extends e.g 'eslint'"
	]
