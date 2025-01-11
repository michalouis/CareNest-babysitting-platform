import React from 'react';
import { useLocation } from 'react-router-dom';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';

const parseTimetable = (params) => {
    const timetable = {};
    Object.keys(params).forEach(key => {
        if (key.startsWith('timetable_')) {
            const [_, day, time] = key.split('_');
            if (!timetable[day]) {
                timetable[day] = [];
            }
            timetable[day].push(time);
        }
    });
    return timetable;
};

const parseSkills = (params, prefix) => {
    const skills = {};
    Object.keys(params).forEach(key => {
        if (key.startsWith(prefix)) {
            const skill = key.split('_')[1];
            skills[skill] = params[key] === 'true';
        }
    });
    return skills;
};

function Results() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterData = Object.fromEntries(queryParams.entries());
    filterData.timeTable = parseTimetable(filterData);
    filterData.languages = parseSkills(filterData, 'languages');
    filterData.music = parseSkills(filterData, 'music');

    return (
        <>
            <PageTitle title="CareNest - Αποτελέσματα Αναζήτησης" />
            <Breadcrumbs />
            <h1>Αποτελέσματα Αναζήτησης</h1>
            <div>
                <h2>Filter Data:</h2>
                <p>Location: {filterData.town}</p>
                <p>Child Age Group: {filterData.childAgeGroup}</p>
                <p>Work Time: {filterData.workTime}</p>
                <h3>Timetable:</h3>
                {Object.keys(filterData.timeTable).map(day => (
                    <div key={day}>
                        <strong>{day}:</strong> {filterData.timeTable[day].join(', ')}
                    </div>
                ))}
                <p>Experience: {filterData.experience}</p>
                <p>Degree: {filterData.degree}</p>
                <h3>Languages:</h3>
                <p>English: {filterData.languages.english ? 'Yes' : 'No'}</p>
                <p>German: {filterData.languages.german ? 'Yes' : 'No'}</p>
                <p>French: {filterData.languages.french ? 'Yes' : 'No'}</p>
                <p>Spanish: {filterData.languages.spanish ? 'Yes' : 'No'}</p>
                <h3>Music Skills:</h3>
                <p>Piano: {filterData.music.piano ? 'Yes' : 'No'}</p>
                <p>Guitar: {filterData.music.guitar ? 'Yes' : 'No'}</p>
                <p>Violin: {filterData.music.violin ? 'Yes' : 'No'}</p>
                <p>Flute: {filterData.music.flute ? 'Yes' : 'No'}</p>
                <h3>Rating:</h3>
                <p>{filterData.rating}</p>
            </div>
        </>
    );
}

export default Results;