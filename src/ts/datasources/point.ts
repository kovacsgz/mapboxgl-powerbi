module powerbi.extensibility.visual.data {
    declare var turf : any;

    export class Point extends Datasource {
        protected colorLimits: mapboxUtils.Limits;
        protected sizeLimits: mapboxUtils.Limits;

        constructor() {
            super()
        }

        addSources(map) {
            map.addSource('data', {
                type: 'geojson',
                data: turf.helpers.featureCollection([]),
                buffer: 0
            });
            return map.getSource('data');
        }

        removeSources(map) {
            map.removeSource('data');
        }

        getLimits() {
            return {
                color: this.colorLimits,
                size: this.sizeLimits,
            }
        }

        ensure(map, layerId) {
            super.ensure(map, layerId)
            const source: any = map.getSource('data');
            if (!source) {
                this.addToMap(map);
            }
            return this;
        }

        update(map, features, roleMap, settings) {
            super.update(map, features, roleMap, settings)
            const featureCollection = turf.helpers.featureCollection(features);
            const source: any = map.getSource('data');
            source.setData(featureCollection);
            this.colorLimits = mapboxUtils.getLimits(features, roleMap.color ? roleMap.color.displayName : '');
            this.sizeLimits = mapboxUtils.getLimits(features, roleMap.size ? roleMap.size.displayName : '');
            this.bounds = turf.bbox(featureCollection);
        }

    }
}

