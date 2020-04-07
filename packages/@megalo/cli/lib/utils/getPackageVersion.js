const { request } = require('@megalo/cli-share-utils')

module.exports = async function getPackageVersion (id, range = '') {
  // const registry = (await require('./shouldUseTaobao')())
  //   ? `https://registry.npm.taobao.org`
  //   : `https://registry.npmjs.org`
  // use registry api to fetch all packages under @megalo scope and return their latest versions
  // https://registry.npmjs.org/-/v1/search?text=scope:megalo
  // taobao registry does not support this api
  // all packages' latest versions under @megalo are different
  // and will update to vue-cli-version-marker in future
  const registry = `https://registry.npmjs.org`

  let result
  try {
    // result = await request.get(`${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`)
    result = await request.get(`${registry}/-/v1/search?text=scope:${id}`)
  } catch (e) {
    return e
  }
  return result;
  // fetch('https://registry.npmjs.com/vue-cli-version-marker/latest')
  //   .then(resp => resp.json())
  //   .then(res => console.log(res.version))
  // 3.11.0
}
