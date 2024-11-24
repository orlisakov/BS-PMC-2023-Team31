
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import AssoSlide from '../home/AssoSlide';
import Footer from '../home/Footer';


describe('Componenets render testing', () => {

    it('renders AssoSlide', () => {
      render(
        <MemoryRouter>
          <AssoSlide />
        </MemoryRouter>
      );
    });

    


    it('renders Footer', () => {
        render(
          <MemoryRouter>
            <Footer />
          </MemoryRouter>
        );
      });

      

    });  
