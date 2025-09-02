import { expect, describe, vi, it, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import ScrollManager from './scrollmanager';
import { BrowserRouter } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import AnchorPDF from './pdf/anchor';
import { locators } from '@vitest/browser/context'
import Canvas from './canvas';
import { TypesetAnchorResp } from '../types';
import { confPdfjs } from '../service/pdf';

// mock the location.

let currentLocation: Location;
let mockNavigate: ReturnType<typeof vi.fn>;

// mock the observer.

const intersectionObserverMock = vi.fn<() => IntersectionObserver>(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
  thresholds: [],
  root: null,
  rootMargin: "0px"
}));

// locate anchors by path.

declare module '@vitest/browser/context' {
  interface LocatorSelectors {
    getByPath(path: string): Locator
  }
}

locators.extend({
  getByPath: (path: string) => {
    return `[data-path="${path}"]`
  }
})

const isInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};

confPdfjs();

const pdf = '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';

beforeEach(() => {
  vi.mock('react-router-dom', async (rrd) => {
    const mod = (await rrd()) as object;

    return {
      ...mod,
      useLocation: () => currentLocation, // Return the controlled currentLocation
      useNavigate: () => mockNavigate,
    };
  });

});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("ScrollManager", () => {
  describe("when rendered with a hash in the url", () => {
    it('scrolls to the corresponding anchor', async () => {
      currentLocation = {
        pathname: '/foo',
        hash: '#bam',
        key: 'key',
        search: '',
        state: null,
      };

      const { getByPath } = render(
        <BrowserRouter>
          <ScrollManager>
            <AnchorPDF style={{ height: "1px", width: "100%", backgroundColor: "red" }} path="/foo#bar" order={1} />
            <div style={{ height: "1000px" }}></div>
            <AnchorPDF style={{ height: "1px", width: "100%", backgroundColor: "red" }} path="/foo#bam" order={2} />
          </ScrollManager>
        </BrowserRouter>
      );

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(isInViewport(getByPath('/foo#bar').element())).toBe(false);
      expect(isInViewport(getByPath('/foo#bam').element())).toBe(true);
    });
  })

  describe("when the users scrolls an anchor into view", () => {
    it('updates the hash in the url', async () => {
      vi.stubGlobal('IntersectionObserver', intersectionObserverMock);

      currentLocation = {
        pathname: '/foo',
        hash: '',
        key: 'key',
        search: '',
        state: null,
      };
      mockNavigate = vi.fn();

      const { getByPath } = render(
        <BrowserRouter>
          <ScrollManager>
            <Canvas objects={[
              {
                type: "anchor",
                success: true,
                pdf,
                out: {
                  title: "anchor",
                  tex: "\bf{anchor}",
                  path: "/foo"
                },
                id: "1",
                order: 1,
              } as TypesetAnchorResp,
            ]} />
          </ScrollManager>
        </BrowserRouter>
      );

      const fauxAnchor = getByPath('/foo').element();
      const anchor = getByPath('/foo#anchor').element();

      const instances = intersectionObserverMock.mock.instances;
      expect(instances.length).toBe(1);

      const instance = instances[0];
      const calls = intersectionObserverMock.mock.calls;
      expect(calls.length).toBe(1);

      const firstCall = calls[0];
      expect(firstCall.length).toBe(2);

      const callback = (firstCall as unknown as [IntersectionObserverCallback, IntersectionObserverInit])[0];
      const triggerIntersection = (target: Element, isIntersecting: boolean) =>
        callback(
          [{
            target,
            isIntersecting,
            intersectionRatio: 1,
            boundingClientRect: new DOMRectReadOnly(),
            intersectionRect: new DOMRectReadOnly(),
            rootBounds: null,
            time: Date.now(),
          }],
          instance
        );

      // discharge the first target.
      triggerIntersection(fauxAnchor, true);
      // move it out of view.
      triggerIntersection(fauxAnchor, false);
      // now move the anchor into view.
      triggerIntersection(anchor, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(mockNavigate).toHaveBeenCalledWith("/foo#anchor", {
        state: {
          noScroll: true,
        },
      })
    })
  });
});