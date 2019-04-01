import {Injectable} from '@angular/core';
import {System, ITime} from './definitions';

@Injectable()
export class AtpCoreService {

    constructor() {
    }

    public allowedTimes(min, max, system: System) {
        const allTimes = [];
        const nowMinHour = +min.split(':')[0];
        const nowMaxHour = +max.split(':')[0];
        const nowMinMin = +min.split(':')[1];
        const nowMaxMin = +max.split(':')[1];
        console.log(nowMinHour, nowMaxHour);
        for (let i = nowMinHour; i <= nowMaxHour; i++) {
            let j = 0,
                jDest = 59;
            if (i === nowMinHour) {
                j = nowMinMin;
            } else if (i === nowMaxHour) {
                jDest = nowMaxMin;
            }
            for (j; j <= jDest; j++) {
                const hour = (i <= 12 || system !== 'SYSTEM12' ? i : i - 12);
                const minute = j;
                let ampm = '';

                if (system === 'SYSTEM12') {
                    ampm = i < 12 ? 'AM' : 'PM';
                }

                allTimes.push(hour + ':' + minute + ampm);
            }
        }
        console.log(allTimes);
        return allTimes;
    }

    public ClockMaker(rayon: number, type: 'minute' | 'hour', format: System): Array<any> {
        const r = rayon;
        const step = type === 'hour' ? 1 : 5;
        let j = r - 25;
        let items = [];

        if (type === 'hour' && format === 'SYSTEM24') {
            items = items.concat(this.drawCircle(r, j, 1, 13, step, type));
            j *= 0.65;
            items = items.concat(this.drawCircle(r, j, 13, 25, step, type));
        } else {
            items = items.concat(this.drawCircle(r, j, (type === 'hour' ? 1 : 0), (type === 'hour' ? 12 : 60), step, type));
        }
        return items;
    }

    public drawCircle(rayon: number, j: number, start: number, length: number, step: number, type: string) {
        const items = [];
        for (let min = start; min < length; min += step) {
                const str = String(min === 24 ? '0' : min);
                const x = j * Math.sin(Math.PI * 2 * (min / (length - start)));
                const y = j * Math.cos(Math.PI * 2 * (min / (length - start)));
                items.push({
                    time: str,
                    left: (x + rayon - 17) + 'px',
                    top: (-y + rayon - 17) + 'px',
                    type
                });
        }
        return items;
    }

    public TimeToString(time: ITime, system: System): string {
        const {ampm, minute, hour} = time;
        let hh;
        if (system === 'SYSTEM12') {
            hh = ampm === 'PM' ? +hour + 12 : +hour;
            if (ampm === 'AM' && hh === 12) {
                hh = 0;
            }
            if (hh === 24) {
                hh = 12;
            }
        } else {
            hh = hour;
        }
        hh = hh < 10 ? '0' + hh : '' + hh as any;
        const mm = minute < 10 ? '0' + minute : minute;
        return `${hh}:${mm}`;
    }

    /**
     * Converts 00:00 system to ITime object
     */
    public StringToTime(time: string, system: System): any {
        const [h, m] = time.split(':');
        const hour = +h > 12 && system === 'SYSTEM12' ? +h - 12 : +h;
        const ampm = +h >= 12 ? 'PM' : 'AM';
        return {
            ampm, minute: +m, hour
        };
    }

    /**
     * @experimental
     */
    public CalcDegrees(ele: any, parrentPos: any, step: number): {degrees: number, hitDistance: number} {
        const clock = {
            width: ele.currentTarget.offsetWidth,
            height: ele.currentTarget.offsetHeight
        };
        const targetX = clock.width / 2;
        const targetY = clock.height / 2;
        const Vx = Math.round((ele.clientX - parrentPos.left) - targetX);
        const Vy = Math.round(targetY - (ele.clientY - parrentPos.top));
        let radians = -Math.atan2(Vy, Vx);
        radians += 2.5 * Math.PI;

        let degrees = Math.round(radians * 180 / Math.PI);
        const hitDistance = Math.sqrt(Math.pow(((ele.clientX - parrentPos.left) - targetX), 2) + Math.pow(((ele.clientY - parrentPos.top) - targetY), 2));
        const degMod = degrees % step;
        if (degMod === 0) {
            return {degrees: degrees, hitDistance: hitDistance};
        } else if (degMod >= step / 2) {
            degrees = degrees + (step - degMod);
        } else if (degMod < step / 2) {
            degrees = degrees - degMod;
        }

        return {degrees: degrees, hitDistance: hitDistance};
    }
}
