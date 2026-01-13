import { ComponentPage } from "~/components/component-page";

export default function CarouselPage() {
  return (
    <ComponentPage
      dependencies={["embla-carousel-solid"]}
      description="Image/content carousel with navigation controls."
      name="carousel"
      registryName="carousel"
      title="Carousel"
    />
  );
}
