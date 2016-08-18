import json

findings = json.load(open('data/findings.json'))
sites = json.load(open('data/excavation_sites.json'))

def get_findings_for_site(site_id):
    filtered_findings = list()
    for finding in findings['features']:
        if finding['properties']['excavation_site_id_pk'] == site_id:
            filtered_findings.append(finding['properties'])
    return filtered_findings

# Add findings to excavation sites
for site in sites['features']:
    site_id = site['properties']['excavation_site_id_pk']
    filtered_findings = get_findings_for_site(site_id)
    site['findings'] = filtered_findings

# Output as geojson
f = open('data/excavation_sites_with_findings.json', 'w')
f.write(json.dumps(sites))