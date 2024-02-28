import { queryParamAtom } from '../utils/queryParamAtom';
import { useAtom } from 'react-atomic-state';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';
import { data } from '../assets/data';

const groupMembersAtom = queryParamAtom('m', JSON.stringify(sampleSize(range(data.length), 5)), {
    replaceState: false,
    validateHydration: (str) => {
        try {
            const value = JSON.parse(str);
            return Array.isArray(value) && value.length > 0 && value.every((v) => Number.isInteger(v));
        } catch (e) {
            return false;
        }
    },
});

export const useGroupMembers = (): number[] => {
    const str = useAtom(groupMembersAtom);
    if (str == null) return [];
    try {
        return JSON.parse(str);
    } catch (e) {
        return [];
    }
};
export const setGroupMembers = (members: number[] | null) => {
    if (members?.length === 0) {
        groupMembersAtom.set(null);
    } else {
        groupMembersAtom.set(JSON.stringify(members));
    }
};
