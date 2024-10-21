/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HomePage, { PAGE_ID_ADD_INSTANCE } from '../src/components/pages/instance-form/Page.tsx';

const pagesToTest = {
    [PAGE_ID_ADD_INSTANCE]: HomePage,
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