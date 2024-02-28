import { atom, Atom } from 'react-atomic-state';

// Note: Based on react-atomic-state, this wrapper allows us to access state in the query params in a reactive way.

export interface QueryParamAtomOptions {
    replaceState?: boolean;
    validateHydration?: (str: string) => boolean;
}

export const queryParamAtom = (
    key: string,
    initialValue: string | null,
    options: QueryParamAtomOptions = {}
): Atom<string | null> => {
    const { replaceState = true, validateHydration = () => true } = options;

    const getValueFromQueryParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const valueFromQueryParams = urlParams.get(key);
        const valueValid = valueFromQueryParams == null ? true : validateHydration(valueFromQueryParams);
        return valueValid ? valueFromQueryParams : initialValue;
    };

    const internalAtom = atom(getValueFromQueryParams() ?? initialValue);

    window.addEventListener('popstate', () => {
        internalAtom.set(getValueFromQueryParams());
    });

    const setParams = (value: string | null) => {
        const urlParams = new URLSearchParams(window.location.search);
        if (value === null) {
            urlParams.delete(key);
        } else {
            urlParams.set(key, value);
        }
        const paramsString = urlParams.toString();
        const nextLocation = window.location.pathname + (paramsString ? '?' + paramsString : '');

        if (replaceState) {
            history.replaceState(null, '', nextLocation);
        } else {
            history.pushState(null, '', nextLocation);
        }
    };

    return {
        get: internalAtom.get,
        set: (value: Parameters<Atom<string | null>['set']>[0]) => {
            const v = typeof value === 'function' ? value(internalAtom.get()) : value;
            setParams(v);
            internalAtom.set(v);
        },
        subscribe: internalAtom.subscribe,
        reset: () => {
            setParams(null);
            internalAtom.set(initialValue);
        },
    };
};
