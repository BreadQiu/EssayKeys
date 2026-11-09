export type EssayDefinition = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const essays: EssayDefinition[] = [
  {
    id: "free-university",
    title: "Should University Education Be Free for Everyone?",
    paragraphs: [
      "Whether higher education should be funded by the state rather than individual students is a contentious issue. While free university education could reduce inequality and create a more skilled workforce, I believe that it must be combined with sensible limits in order to remain financially sustainable.",
      "The strongest argument for removing tuition fees is that talent should not depend on family wealth. In many countries, capable students decide against university because they fear long-term debt. This reduces social mobility and prevents employers from benefiting from a wider pool of skilled graduates. Free tuition would give these students a genuine opportunity to develop their abilities, and the resulting increase in productivity could eventually repay the public investment through higher tax revenue.",
      "However, unrestricted free education places a heavy burden on public budgets. Governments would need to fund not only teaching but also accommodation and administration, potentially reducing spending on healthcare or primary schools. In addition, students from wealthy families would receive the same subsidy as those facing serious financial hardship. A fairer approach may therefore involve means-tested grants, low-interest loans and scholarships for students who need support most. This would keep university accessible without asking taxpayers to fund every student regardless of income.",
      "In conclusion, I agree that financial barriers should not prevent talented people from attending university. Nevertheless, complete abolition of tuition fees is not the only fair solution. Targeted financial support is more practical, as it can widen access while preserving the quality and long-term stability of the education system.",
    ],
  },
  {
    id: "technology-sociability",
    title: "Does Technology Make Us Less Sociable?",
    paragraphs: [
      "Digital devices now occupy a central place in daily communication, prompting concern that people are becoming less sociable. Although technology can encourage superficial interaction and reduce face-to-face contact, I believe its overall effect depends on how it is used rather than on the devices themselves.",
      "On the one hand, constant access to screens may weaken the quality of personal relationships. People often check messages during meals or conversations, which can make those around them feel ignored. Social media also encourages users to present polished versions of their lives, and the resulting comparison can increase anxiety rather than genuine connection. When individuals replace repeated real-world meetings with brief online exchanges, the trust and emotional understanding that develop through shared experiences may be lost. Online messages also lack tone of voice and facial expression, which can easily turn a harmless comment into a misunderstanding.",
      "On the other hand, digital communication allows relationships to survive distance and busy schedules. Families living in different countries can speak regularly, while students and professionals can maintain friendships through instant messaging and video calls. Online communities also provide support for people who are isolated, have uncommon interests or find face-to-face interaction particularly difficult. For them, technology is not a barrier to social contact but the tool that makes it possible.",
      "In conclusion, technology does not automatically make society less sociable. It can distract people from those physically present, but it can also strengthen relationships across distance and bring together individuals with similar needs. The key is to use digital tools thoughtfully while protecting time for attentive, real-world communication.",
    ],
  },
  {
    id: "remote-work",
    title: "Is Remote Work Good for Employees and Employers?",
    paragraphs: [
      "Remote work has moved from a rare privilege to a normal arrangement in many industries. While it offers employees greater control over their time and can reduce costs for employers, it also creates challenges involving collaboration, supervision and social contact. On balance, it can be highly beneficial when supported by clear working practices.",
      "For employees, the main advantage is flexibility. Avoiding a daily commute saves time and money, and employees can often arrange their working hours around family responsibilities or personal needs. A quieter home environment may also improve concentration for people whose offices are noisy. Many workers report that this greater autonomy increases their job satisfaction and makes them less likely to leave their employer. This flexibility can also make it easier for parents and people with health conditions to remain in employment.",
      "For organisations, remote work can reduce spending on office space and allow them to recruit talented staff from a much wider geographical area. However, managers cannot always see how work is progressing, so they must rely on clear goals and measurable results. New employees may also find it harder to learn from colleagues remotely, while spontaneous discussions and creative teamwork can become less frequent. If businesses overlook these difficulties, productivity and workplace culture may suffer.",
      "In conclusion, remote work is good for both parties when it is used with appropriate support. Employees benefit from flexibility, and employers gain lower costs and access to broader talent. To preserve collaboration and trust, however, companies should combine remote arrangements with regular communication and occasional face-to-face meetings.",
    ],
  },
];

export function getEssayById(id: string): EssayDefinition | undefined {
  return essays.find((essay) => essay.id === id);
}

export function getEssayTarget(essay: EssayDefinition): string {
  return essay.paragraphs.join(" ");
}

export function countWords(essay: EssayDefinition): number {
  return essay.paragraphs
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
