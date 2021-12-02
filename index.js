const chalk = require("chalk");
const yaml = require("js-yaml");
const fs = require("fs");
const ramda = require("ramda");

const langMap = {
  "en_US.UTF-8": "en",
};

const yellow = (strings, ...args) => {
  const string = String.raw({ raw: strings }, args);

  return chalk.yellow(string);
};

function getEnvLocaleLang(env) {
  env = env || process.env;

  const lang = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;

  return langMap[lang];
}

function interpolate(string, args = {}) {
  return new Function(
    ...Object.keys(args),
    "yellow",
    "return `" + string + "`"
  )(...Object.values(args), yellow);
}

function run() {
  const lang = getEnvLocaleLang();
  const key = [lang, "app"];
  const langFile = fs.readFileSync(`${lang}.yaml`);
  const doc = yaml.load(langFile);

  console.log(interpolate(ramda.path([...key, "basicString"], doc)));
  console.log(
    interpolate(ramda.path([...key, "stringWithToken"], doc), {
      token: "this is the token value",
    })
  );
  console.log(
    interpolate(ramda.path([...key, "stringWithTwoTokens"], doc), {
      token: "this is the token value",
      token2: "this is the token2 value",
    })
  );
  console.log(interpolate(ramda.path([...key, "stringWithColor"], doc)));
  console.log(
    interpolate(ramda.path([...key, "stringWithColorAndToken"], doc), {
      token: "token value",
    })
  );
}

run();
