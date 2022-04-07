//   
//  NLP Text to template, see https://forum.waylay.io/t/a-web-script-for-end2end-nlp-text-to-template/84
//
const NLP_ENDPOINT = 'https://nlp-io.waylay.io/nlp/v0'
const RULES_ENDPOINT = 'https://api-io.waylay.io/rules/v1'
const DEFAULT_RULEBASE = 'weather_only'
const TRIGGER_RESOURCE = 'nlpWebscriptActuation'

// as `waylay.nlp` is currently not general available, we use this `waylay._request` workaround
// for authenticated api calls to the waylay API
async function invokeNlpTextToTemplate (rulebase, utterance) {
  return waylay._request({
    url: `${NLP_ENDPOINT}/rulebase/${rulebase}`,
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    data : { utterance }
  })
}

async function invokeTemplateRun( templateNetwork ) {
  // a small hack until trigger input binding is correctly implemented
  // or we have a way to run a template with a single tick
  templateNetwork.sensors[0].dataTrigger=true
  templateNetwork.sensors[0].resource='$'
  return waylay._request({
    url: `${RULES_ENDPOINT}/templates/run`,
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    data : { 
      graph: templateNetwork,
      data: [ [ { resource: TRIGGER_RESOURCE } ] ],
      conf: {
        resource: TRIGGER_RESOURCE,
        resetObservations: true,
        executeActuators: false
      }
    }
  })
}

async function handleRequest (req, res) {
  if (req.method !== 'POST') {
    res.sendStatus(405)
    return
  }
  try {
    const { rulebase=DEFAULT_RULEBASE, utterance } = req.body
    const { canonical, rule_template } = await invokeNlpTextToTemplate(rulebase, utterance);
    const { sensors } = await invokeTemplateRun(rule_template)
    res.send({ utterance, canonical, sensors });
  } catch (err) {
    const error = err.response ? err.response.data : err.message;
    console.error(error);
    res.status(500).send(error);
  }
}