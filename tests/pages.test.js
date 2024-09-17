/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HomePage, { PAGE_ID_HOMEPAGE } from '../src/components/pages/home/Page.jsx';

const pagesToTest = {
    [PAGE_ID_HOMEPAGE]: HomePage,
};

describe('Page Rendering', () => {
    // Utility function to test rendering of pages
    const renderPage = (PageComponent, pageID) => {
        render(
            <MemoryRouter>
                <PageComponent />
            </MemoryRouter>
        );
        const element = screen.getByTestId(pageID);
        expect(element).toBeInTheDocument();
    };

    for (const [pageID, pageComponent] of Object.entries(pagesToTest)) {
        test(`${pageID} renders without errors`, () => {
            renderPage(pageComponent, pageID);
        });
    }
});