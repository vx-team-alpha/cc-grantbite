<script>
  import { ArrowRight } from "lucide-svelte"
  import Button from "./button.svelte"
</script>

<div class="p-8 bg-gray-50 min-h-screen">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">Button Design System</h1>

    <!-- Default State Buttons -->
    <div class="bg-white p-8 rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold mb-8 text-gray-800">Buttons</h2>
      <div class="space-y-6">
        <div>
          <Button onClick={() => {}} variant="primary" size="icon">
            <ArrowRight class="h-4 w-4" />
          </Button>
        </div>

        <div>
          <Button onClick={() => {}} variant="outline" size="default"
            >Sign In</Button
          >
        </div>

        <div>
          <Button onClick={() => {}} variant="primary" size="default"
            >Sign Up</Button
          >
        </div>

        <div>
          <Button onClick={() => {}} variant="secondary" size="default">
            Request Consultation
          </Button>
        </div>

        <div>
          <Button onClick={() => {}} variant="primary" size="default"
            >Show Details</Button
          >
        </div>

        <div>
          <Button onClick={() => {}} variant="primary" size="lg"
            >Submit Program</Button
          >
        </div>

        <div>
          <Button onClick={() => {}} variant="primary" size="full"
            >Sign In</Button
          >
        </div>
      </div>
    </div>

    <!-- Variant Reference -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">
        Available Variants
      </h3>
      <div class="flex flex-wrap gap-4">
        <Button onClick={() => {}} variant="primary">Primary</Button>
        <Button onClick={() => {}} variant="outline">Outline</Button>
        <Button onClick={() => {}} variant="secondary">Secondary</Button>
        <Button onClick={() => {}} variant="ghost">Ghost</Button>
      </div>
    </div>

    <!-- Size Reference -->
    <div class="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Available Sizes</h3>
      <div class="flex flex-wrap gap-4 items-center">
        <Button onClick={() => {}} variant="primary" size="sm">Small</Button>
        <Button onClick={() => {}} variant="primary" size="default"
          >Default</Button
        >
        <Button onClick={() => {}} variant="primary" size="lg">Large</Button>
        <Button onClick={() => {}} variant="primary" size="icon">
          <ArrowRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</div>
