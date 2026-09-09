import { useEffect } from "react";

type PageMeta = {
  title: string;
  description: string;
  image?: string;
  url: string;
};

type MetaDefinition = {
  selector: string;
  attribute: "name" | "property";
  key: string;
  content: string;
};

function updateMeta(definition: MetaDefinition) {
  let element = document.querySelector<HTMLMetaElement>(definition.selector);
  const created = !element;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(definition.attribute, definition.key);
    document.head.appendChild(element);
  }

  const previousContent = element.getAttribute("content");
  element.setAttribute("content", definition.content);

  return () => {
    if (created) {
      element.remove();
    } else if (previousContent === null) {
      element.removeAttribute("content");
    } else {
      element.setAttribute("content", previousContent);
    }
  };
}

export function usePageMeta({ title, description, image, url }: PageMeta) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const definitions: MetaDefinition[] = [
      {
        selector: 'meta[name="description"]',
        attribute: "name",
        key: "description",
        content: description,
      },
      {
        selector: 'meta[property="og:title"]',
        attribute: "property",
        key: "og:title",
        content: title,
      },
      {
        selector: 'meta[property="og:description"]',
        attribute: "property",
        key: "og:description",
        content: description,
      },
      { selector: 'meta[property="og:url"]', attribute: "property", key: "og:url", content: url },
      {
        selector: 'meta[name="twitter:title"]',
        attribute: "name",
        key: "twitter:title",
        content: title,
      },
      {
        selector: 'meta[name="twitter:description"]',
        attribute: "name",
        key: "twitter:description",
        content: description,
      },
    ];

    if (image) {
      definitions.push(
        {
          selector: 'meta[property="og:image"]',
          attribute: "property",
          key: "og:image",
          content: image,
        },
        {
          selector: 'meta[name="twitter:image"]',
          attribute: "name",
          key: "twitter:image",
          content: image,
        },
      );
    }

    const restoreMeta = definitions.map(updateMeta);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.href;
    const canonicalElement = canonical ?? document.createElement("link");
    if (!canonical) {
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = url;

    return () => {
      document.title = previousTitle;
      restoreMeta.forEach((restore) => restore());
      if (!canonical) {
        canonicalElement.remove();
      } else if (previousCanonical) {
        canonical.href = previousCanonical;
      }
    };
  }, [description, image, title, url]);
}
