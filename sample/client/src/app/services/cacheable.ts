import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from "rxjs/ReplaySubject";


export function cacheable<T>(o: Observable<T>): Observable<T> {
  let replay = new ReplaySubject<T>(1);
  o.subscribe(
    x => replay.next(x),
    x => replay.error(x),
    () => replay.complete()
  );
  return replay.asObservable();
}
