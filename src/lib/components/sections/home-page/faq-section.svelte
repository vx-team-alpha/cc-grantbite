<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js"
  import { ChevronRight } from "lucide-svelte"
  import { m } from "$lib/paraglide/messages"
</script>

<section class="flex flex-col items-center gap-y-14 mt-14 px-4">
  <h2 class="text-h1 font-bold text-center">
    {m.frequently_asked_questions()}
  </h2>

  <Accordion.Root type="multiple" class="w-full space-y-5 max-w-6xl">
    <Accordion.Item
      value={m.faq_question_1()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_1()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_1()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_2()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_2()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_2()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_3()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_3()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_3()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_4()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_4()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_4()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_5()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_5()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_5()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_6()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_6()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_6()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_7()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_7()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_7()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_8()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_8()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_8()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_9()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_9()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_9()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_10()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_10()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_10()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_11()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_11()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_11()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_12()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_12()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_12()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_13()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_13()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_13()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_14()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_14()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_14()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_15()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_15()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_15()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_16()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_16()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_16()}</p>
      </Accordion.Content>
    </Accordion.Item>

    <Accordion.Item
      value={m.faq_question_17()}
      class="rounded-lg border border-[#D4D2D2] bg-[#FAFAFA] overflow-hidden"
    >
      <Accordion.Trigger
        class="flex items-center justify-between w-full p-6 text-left font-medium text-base sm:text-lg cursor-pointer"
      >
        <span>{m.faq_question_17()}</span>
      </Accordion.Trigger>
      <Accordion.Content
        class="p-4 pt-0 text-sm sm:text-base text-muted-foreground"
      >
        <p>{m.faq_answer_17()}</p>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</section>
