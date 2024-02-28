import json from './data.json';

export interface RawDataEntry {
    alias: string;
    timestamp: string;
    otherUniversity: string;
    studyStartYear: number;
    graduationDate: string;
    major: string;
    degree: string;
    interests: string;
    learnings: string;
    relevantCourses: string;
    usesCanvas: string;
    skillInformationVisualization: number;
    skillStatistics: number;
    skillMathematics: number;
    skillArtistic: number;
    skillComputerUsage: number;
    skillProgramming: number;
    skillComputerGraphicsProgramming: number;
    skillHCIProgramming: number;
    skillExperienceEvaluation: number;
    skillCommunication: number;
    skillCollaboration: number;
    skillCodeRepository: number;
    thesisStatus: string;
    futureOutlook: string;
}

export class DataEntry {
    alias: string;
    timestamp: Date;
    otherUniversity: string;
    studyStartYear: number;
    graduationDate: Date;
    major: string;
    degree: string;
    interests: string;
    learnings: string;
    relevantCourses: string;
    usesCanvas: string;
    skillInformationVisualization: number;
    skillStatistics: number;
    skillMathematics: number;
    skillArtistic: number;
    skillComputerUsage: number;
    skillProgramming: number;
    skillComputerGraphicsProgramming: number;
    skillHCIProgramming: number;
    skillExperienceEvaluation: number;
    skillCommunication: number;
    skillCollaboration: number;
    skillCodeRepository: number;
    thesisStatus: string;
    futureOutlook: string;

    constructor(jsonEntry: RawDataEntry) {
        this.alias = jsonEntry.alias;
        this.timestamp = new Date(jsonEntry.timestamp);
        this.otherUniversity = jsonEntry.otherUniversity;
        this.studyStartYear = jsonEntry.studyStartYear;
        this.graduationDate = new Date(jsonEntry.graduationDate);
        this.major = jsonEntry.major;
        this.degree = jsonEntry.degree;
        this.interests = jsonEntry.interests;
        this.learnings = jsonEntry.learnings;
        this.relevantCourses = jsonEntry.relevantCourses;
        this.usesCanvas = jsonEntry.usesCanvas;
        this.skillInformationVisualization = jsonEntry.skillInformationVisualization;
        this.skillStatistics = jsonEntry.skillStatistics;
        this.skillMathematics = jsonEntry.skillMathematics;
        this.skillArtistic = jsonEntry.skillArtistic;
        this.skillComputerUsage = jsonEntry.skillComputerUsage;
        this.skillProgramming = jsonEntry.skillProgramming;
        this.skillComputerGraphicsProgramming = jsonEntry.skillComputerGraphicsProgramming;
        this.skillHCIProgramming = jsonEntry.skillHCIProgramming;
        this.skillExperienceEvaluation = jsonEntry.skillExperienceEvaluation;
        this.skillCommunication = jsonEntry.skillCommunication;
        this.skillCollaboration = jsonEntry.skillCollaboration;
        this.skillCodeRepository = jsonEntry.skillCodeRepository;
        this.thesisStatus = jsonEntry.thesisStatus;
        this.futureOutlook = jsonEntry.futureOutlook;
    }

    get allSkills() {
        const skills = new Map<string, number>();
        skills.set('skillInformationVisualization', this.skillInformationVisualization);
        skills.set('skillStatistics', this.skillStatistics);
        skills.set('skillMathematics', this.skillMathematics);
        skills.set('skillComputerUsage', this.skillComputerUsage);
        skills.set('skillProgramming', this.skillProgramming);
        skills.set('skillComputerGraphicsProgramming', this.skillComputerGraphicsProgramming);
        skills.set('skillHCIProgramming', this.skillHCIProgramming);
        skills.set('skillCodeRepository', this.skillCodeRepository);
        skills.set('skillCollaboration', this.skillCollaboration);
        skills.set('skillCommunication', this.skillCommunication);
        skills.set('skillArtistic', this.skillArtistic);
        skills.set('skillExperienceEvaluation', this.skillExperienceEvaluation);
        return skills;
    }

    get meanSkillScore(): number {
        return this.totalSkillScore / this.allSkills.size;
    }

    get totalSkillScore(): number {
        return [...this.allSkills.values()].reduce((acc, curr) => acc + curr, 0);
    }
}

export const data = json.map((entry) => {
    return new DataEntry(entry);
}) as Array<DataEntry>;

export const computed = {
    maxSkillScore: 10,
    skillsCount: 12,
    totalSkillScore: data.reduce((acc, e) => acc + e.totalSkillScore, 0),
    skillLabels: {
        meanSkillScore: 'Average of All Skills',
        skillInformationVisualization: 'Information Visualization',
        skillStatistics: 'Statistics',
        skillMathematics: 'Mathematics',
        skillComputerUsage: 'Computer Usage',
        skillProgramming: 'Programming',
        skillComputerGraphicsProgramming: 'CG Programming',
        skillHCIProgramming: 'HCI Programming',
        skillCodeRepository: 'Code Repository',
        skillCollaboration: 'Collaboration',
        skillCommunication: 'Communication',
        skillExperienceEvaluation: 'Experience Evaluation',
        skillArtistic: 'Artistic',
    },
};
