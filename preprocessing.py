import json
import re

findings = json.load(open('data/findings.json'))
sites = json.load(open('data/excavation_sites.json'))

def move_year_to_own_field():
    for finding in findings['features']:
	archaelogist = finding['properties']['archaeologist_name']
	m = re.search("[0-9]{4}", archaelogist)
	if m:
	    finding['properties']['year'] = m.group()

def get_findings_for_site(site_id):
    filtered_findings = list()
    for finding in findings['features']:
        if finding['properties']['excavation_site_id_pk'] == site_id:
            filtered_findings.append(finding['properties'])
    return filtered_findings

move_year_to_own_field()
# Add findings to excavation sites
for site in sites['features']:
    site_id = site['properties']['excavation_site_id_pk']
    filtered_findings = get_findings_for_site(site_id)
    site['findings'] = filtered_findings

# Output as geojson
f = open('data/excavation_sites_with_findings.json', 'w')
f.write(json.dumps(sites))
