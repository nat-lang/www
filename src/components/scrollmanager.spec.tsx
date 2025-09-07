import { expect, describe, vi, it, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import ScrollManager from './scrollmanager';
import { BrowserRouter } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import Anchor from './canvas/anchor';
import { locators } from '@vitest/browser/context'
import Canvas from './canvas/canvas';
import { StampedAnchorResp } from '../types';
import { CanvasAnchor } from '../context/canvas';

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
            <Anchor path="/foo#bar" order={1}>{"# Foo"}</Anchor>
            <div style={{ height: "1000px" }}></div>
            <Anchor path="/foo#bam" order={2}>{"# Bar"}</Anchor>
          </ScrollManager>
        </BrowserRouter>
      );

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(isInViewport(getByPath('/foo#bar').element())).toBe(false);
      expect(isInViewport(getByPath('/foo#bam').element())).toBe(true);
    });
  })

  describe("when the user scrolls an anchor into view", () => {
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
            <Canvas width={100} objects={[
              {
                type: "anchor",
                success: true,
                out: {
                  title: "anchor",
                  md: "**anchor**",
                  path: "/foo"
                },
                slug: "anchor",
                id: "1",
                order: 1,
              } as CanvasAnchor,
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