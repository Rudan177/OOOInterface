/**
 * 天气小组件
 * 数据源：Open-Meteo（免费无 Key）
 * - 定位优先（navigator.geolocation），失败回退到配置城市（默认南昌）
 * - 每 30 分钟刷新一次
 * - 天气图标使用 Material Symbols
 * - 正方形：垂直布局（图标+温度居中，城市/描述下方）
 * - 长方形：横向布局（左图标+温度，右城市+详情）
 */
class WeatherWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'weather';
        this.city = (this.data && this.data.city) || '南昌';
        // 仅当缓存坐标对应的城市与当前城市一致时才复用，避免改城市后仍用旧坐标
        const coordsMatch = !!(this.data && this.data.coordsCity === this.city);
        this.coords = (coordsMatch && this.data && this.data.lat && this.data.lon)
            ? { lat: this.data.lat, lon: this.data.lon }
            : null;
        this.lastUpdate = (this.data && this.data.lastUpdate) || 0;
        this.cachedWeather = (this.data && this.data.cached) || null;
        // 城市变更后旧缓存天气失效，强制重新获取
        if (!coordsMatch && this.cachedWeather) {
            this.cachedWeather = null;
            this.lastUpdate = 0;
        }
    }

    buildContent() {
        this.element.classList.add('widget-weather');
        this.isRect = this.size === 'rectangle';

        if (this.isRect) {
            this.buildRectangleLayout();
        } else {
            this.buildSquareLayout();
        }

        if (this.cachedWeather) {
            this.applyWeather(this.cachedWeather);
        } else {
            this.renderLoading();
        }
    }

    buildSquareLayout() {
        this.iconEl = document.createElement('span');
        this.iconEl.className = 'material-symbols-outlined widget-weather-icon';

        this.tempEl = document.createElement('div');
        this.tempEl.className = 'widget-weather-temp';

        this.descEl = document.createElement('div');
        this.descEl.className = 'widget-weather-desc';

        this.cityEl = document.createElement('div');
        this.cityEl.className = 'widget-weather-city';

        this.element.appendChild(this.iconEl);
        this.element.appendChild(this.tempEl);
        this.element.appendChild(this.descEl);
        this.element.appendChild(this.cityEl);
    }

    buildRectangleLayout() {
        // 左侧：图标 + 温度
        this.leftPanel = document.createElement('div');
        this.leftPanel.className = 'widget-weather-left';

        this.iconEl = document.createElement('span');
        this.iconEl.className = 'material-symbols-outlined widget-weather-icon-rect';

        this.tempEl = document.createElement('div');
        this.tempEl.className = 'widget-weather-temp-rect';

        this.leftPanel.appendChild(this.iconEl);
        this.leftPanel.appendChild(this.tempEl);

        // 右侧：城市 + 描述 + 湿度 + 风速
        this.rightPanel = document.createElement('div');
        this.rightPanel.className = 'widget-weather-right';

        this.cityEl = document.createElement('div');
        this.cityEl.className = 'widget-weather-city-rect';

        this.descEl = document.createElement('div');
        this.descEl.className = 'widget-weather-desc-rect';

        this.extraEl = document.createElement('div');
        this.extraEl.className = 'widget-weather-extra';

        this.humidityEl = document.createElement('span');
        this.humidityEl.className = 'widget-weather-extra-item';
        this.windEl = document.createElement('span');
        this.windEl.className = 'widget-weather-extra-item';

        this.extraEl.appendChild(this.humidityEl);
        this.extraEl.appendChild(this.windEl);

        this.rightPanel.appendChild(this.cityEl);
        this.rightPanel.appendChild(this.descEl);
        this.rightPanel.appendChild(this.extraEl);

        this.element.appendChild(this.leftPanel);
        this.element.appendChild(this.rightPanel);
    }

    renderLoading() {
        if (this.isRect) {
            this.iconEl.textContent = 'sunny';
            this.tempEl.textContent = '--°';
            this.cityEl.textContent = this.city;
            this.descEl.textContent = '加载中…';
            this.humidityEl.textContent = '';
            this.windEl.textContent = '';
        } else {
            this.iconEl.textContent = 'sunny';
            this.tempEl.textContent = '--°';
            this.descEl.textContent = '加载中…';
            this.cityEl.textContent = this.city;
        }
    }

    afterMount() {
        this.refresh();
        this.setIntervalTimer(() => this.refresh(), 30 * 60 * 1000);
    }

    async refresh() {
        if (this.cachedWeather && Date.now() - this.lastUpdate < 10 * 60 * 1000) {
            return;
        }

        // 解析坐标：留空/“当前位置”→ 浏览器定位；命名城市 → 地理编码
        if (!this.coords) {
            const resolved = await this.resolveCoords();
            if (!resolved) {
                this.showError('城市定位失败');
                return;
            }
            this.coords = resolved;
        }

        try {
            const url = 'https://api.open-meteo.com/v1/forecast' +
                '?latitude=' + this.coords.lat +
                '&longitude=' + this.coords.lon +
                '&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m' +
                '&timezone=auto';
            const data = await this.fetchJSON(url);
            if (data && data.current) {
                const wmo = this.mapWmoCode(data.current.weather_code);
                const weather = {
                    temp: Math.round(data.current.temperature_2m),
                    icon: wmo.icon,
                    desc: wmo.desc,
                    city: this.city,
                    humidity: data.current.relative_humidity_2m,
                    wind: data.current.wind_speed_10m
                };
                this.cachedWeather = weather;
                this.lastUpdate = Date.now();
                this.data.lat = this.coords.lat;
                this.data.lon = this.coords.lon;
                this.data.coordsCity = this.city;
                this.data.city = this.city;
                this.data.cached = weather;
                this.data.lastUpdate = this.lastUpdate;
                this.persist();
                this.applyWeather(weather);
            }
        } catch (err) {
            console.warn('[WeatherWidget] 天气获取失败:', err.message);
            if (!this.cachedWeather) {
                this.showError('天气获取失败');
            }
        }
    }

    applyWeather(w) {
        // 兼容旧缓存：Material Icons 图标名 → Material Symbols 图标名（历史数据仅 wb_sunny 需要转换）
        const iconFix = { 'wb_sunny': 'sunny' };
        if (iconFix[w.icon]) w.icon = iconFix[w.icon];
        if (!w.icon) w.icon = 'sunny'; // 兜底：缓存缺图标字段时使用默认
        this.iconEl.textContent = w.icon;
        this.tempEl.textContent = w.temp + '°';
        this.descEl.textContent = w.desc;
        this.descEl.classList.remove('widget-weather-error');
        this.cityEl.textContent = w.city || this.city;

        if (this.isRect && this.humidityEl) {
            this.humidityEl.textContent = w.humidity + '%';
            this.windEl.textContent = w.wind + 'km/h';
        }
    }

    tryGeolocate() {
        return new Promise((resolve) => {
            if (!('geolocation' in navigator)) { resolve(null); return; }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => resolve(null),
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 10 * 60 * 1000 }
            );
        });
    }

    // 解析坐标：未配置城市或“当前位置”走浏览器定位，命名城市走地理编码
    async resolveCoords() {
        if (!this.city || this.city === '当前位置') {
            const located = await this.tryGeolocate();
            if (located) {
                this.city = '当前位置';
                return located;
            }
            // 定位失败回退到默认城市南昌
            return { lat: 28.68, lon: 115.8575 };
        }
        return this.geocodeCity(this.city);
    }

    // 使用 Open-Meteo 地理编码接口把城市名解析为经纬度
    async geocodeCity(name) {
        try {
            const url = 'https://geocoding-api.open-meteo.com/v1/search'
                + '?name=' + encodeURIComponent(name)
                + '&count=1&language=zh&format=json';
            const data = await this.fetchJSON(url);
            if (data && Array.isArray(data.results) && data.results.length) {
                return { lat: data.results[0].latitude, lon: data.results[0].longitude };
            }
        } catch (e) {
            console.warn('[WeatherWidget] 城市地理编码失败:', e.message);
        }
        return null;
    }

    showError(message) {
        if (!this.tempEl) return;
        this.tempEl.textContent = '--°';
        this.descEl.textContent = message;
        this.descEl.classList.add('widget-weather-error');
    }

    mapWmoCode(code) {
        const map = {
            0:  { icon: 'sunny',           desc: '晴朗' },
            1:  { icon: 'partly_cloudy_day', desc: '基本晴朗' },
            2:  { icon: 'cloud',          desc: '局部多云' },
            3:  { icon: 'cloud',          desc: '阴天' },
            45: { icon: 'foggy',          desc: '有雾' },
            48: { icon: 'foggy',          desc: '雾凇' },
            51: { icon: 'rainy_light',    desc: '小毛毛雨' },
            53: { icon: 'rainy',          desc: '毛毛雨' },
            55: { icon: 'rainy_heavy',    desc: '浓毛毛雨' },
            56: { icon: 'rainy_light',    desc: '冻毛毛雨' },
            57: { icon: 'rainy_heavy',    desc: '强冻毛毛雨' },
            61: { icon: 'rainy_light',    desc: '小雨' },
            63: { icon: 'rainy',          desc: '中雨' },
            65: { icon: 'rainy_heavy',    desc: '大雨' },
            66: { icon: 'rainy_light',    desc: '冻雨' },
            67: { icon: 'rainy_heavy',    desc: '强冻雨' },
            71: { icon: 'ac_unit',        desc: '小雪' },
            73: { icon: 'ac_unit',        desc: '中雪' },
            75: { icon: 'ac_unit',        desc: '大雪' },
            77: { icon: 'ac_unit',        desc: '雪粒' },
            80: { icon: 'rainy_light',    desc: '阵雨' },
            81: { icon: 'rainy',          desc: '强阵雨' },
            82: { icon: 'rainy_heavy',    desc: '暴雨' },
            85: { icon: 'ac_unit',        desc: '阵雪' },
            86: { icon: 'ac_unit',        desc: '强阵雪' },
            95: { icon: 'thunderstorm',   desc: '雷暴' },
            96: { icon: 'thunderstorm',   desc: '雷暴伴冰雹' },
            99: { icon: 'thunderstorm',   desc: '强雷暴' }
        };
        return map[code] || { icon: 'sunny', desc: '未知天气' };
    }
}
