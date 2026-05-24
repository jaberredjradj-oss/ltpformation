import { inline, labeledItem, listItem, paragraph, plainList, plainParagraph } from "@/lib/legal/helpers";
import type { LegalDocumentDefinition } from "@/lib/legal/types";

export const cgvDocument: LegalDocumentDefinition = {
  id: "cgv",
  title: "Conditions Générales de Vente (CGV)",
  pdfFilename: "cgv.pdf",
  pdfDownloadLabel: "Télécharger les Conditions Générales de Vente",
  seoTitle: "Conditions Générales de Vente",
  seoDescription:
    "CGV de LT Protect Formation : modalités d'inscription, tarifs, financements (OPCO, CPF), annulation, obligations et responsabilités de l'organisme de formation.",
  path: "/cgv",
  heroEyebrow: "Conditions contractuelles",
  sections: [
    {
      title: "1. Préambule et objet",
      blocks: [
        plainParagraph(
          "LT PROTECT FORMATION est un organisme de formation professionnelle continue domicilié au 26 Avenue René Duguay-Trouin bâtiment A, 78960 Voisins-le-Bretonneux.",
        ),
      ],
      subsections: [
        {
          title: "1.1 Identifiants de l'organisme",
          blocks: [
            {
              type: "list",
              items: [
                labeledItem("SIRET", "87957170100025"),
                labeledItem("Code NAF", "8559A"),
                labeledItem("Déclaration d'activité", "11788581978"),
                labeledItem("Agrément SSIAP", "078-020"),
                labeledItem("ADEF", "7823092901"),
                labeledItem("CNAPS", "FOR-078-2028-12-01-20230885785"),
              ],
            },
          ],
        },
      ],
      afterSubsections: [
        plainParagraph(
          "Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les modalités et conditions dans lesquelles LT PROTECT FORMATION commercialise et dispense ses actions de formation (notamment formations en sécurité incendie SSIAP, sécurité privée CNAPS, et autres formations liées à la sécurité) auprès de ses clients (entreprises, particuliers, organismes financeurs).",
        ),
      ],
    },
    {
      title: "2. Champ d'application",
      blocks: [
        plainParagraph(
          "Les présentes CGV s'appliquent, sans restriction ni réserve, à l'ensemble des prestations de formation proposées par LT PROTECT FORMATION. Elles prévalent sur tout autre document du client, et notamment sur toutes conditions générales d'achat, sauf accord dérogatoire exprès et écrit de notre part.",
        ),
        plainParagraph(
          "Toute inscription ou commande de formation implique l'adhésion entière et sans réserve du client aux présentes conditions générales de vente. Le client reconnaît avoir pris connaissance des CGV préalablement à son inscription.",
        ),
      ],
    },
    {
      title: "3. Offre de formation et inscription",
      blocks: [
        plainParagraph(
          "Les caractéristiques des formations (contenu, objectifs, durée, prérequis, modalités pédagogiques) sont détaillées dans le catalogue de formation ou les programmes spécifiques remis au client.",
        ),
      ],
      subsections: [
        {
          title: "3.1 Formalisation de l'inscription",
          blocks: [
            {
              type: "list",
              items: [
                listItem(
                  inline("Pour les entreprises", { bold: true }),
                  inline(" : la signature d'une convention de formation professionnelle."),
                ),
                listItem(
                  inline("Pour les particuliers", { bold: true }),
                  inline(" : la signature d'un contrat de formation professionnelle."),
                ),
              ],
            },
          ],
        },
        {
          title: "3.2 Documents remis",
          blocks: [
            {
              type: "list",
              items: [
                listItem(inline("Le programme de la formation")),
                listItem(inline("Le règlement intérieur applicable aux stagiaires")),
                listItem(inline("Les présentes Conditions Générales de Vente")),
              ],
            },
            plainParagraph(
              "L'inscription n'est validée définitivement qu'à réception du document contractuel signé (convention ou contrat) et, le cas échéant, du règlement ou de l'acompte prévu.",
            ),
          ],
        },
      ],
    },
    {
      title: "4. Tarifs et modalités de paiement",
      blocks: [
        plainParagraph(
          "Les prix des formations sont indiqués en euros TTC. Conformément à l'article 293 B du Code Général des Impôts, la TVA n'est pas applicable.",
        ),
      ],
      subsections: [
        {
          title: "4.1 Financement",
          blocks: [
            {
              type: "list",
              items: [
                listItem(
                  inline("Entreprises / OPCO", { bold: true }),
                  inline(
                    " : en cas de prise en charge par un OPCO, il appartient au client d'effectuer la demande de prise en charge avant le début de la formation et de s'assurer de l'accord de financement. En cas de refus de prise en charge ou de prise en charge partielle, le coût de la formation restera à la charge du client.",
                  ),
                ),
                listItem(
                  inline("CPF / Pôle Emploi", { bold: true }),
                  inline(
                    " : les inscriptions via ces dispositifs suivent les règles spécifiques des plateformes concernées (Mon Compte Formation, Kairos).",
                  ),
                ),
                listItem(
                  inline("Particuliers", { bold: true }),
                  inline(
                    " : le paiement s'effectue selon les modalités définies dans le contrat de formation (échelonnement possible selon accord).",
                  ),
                ),
              ],
            },
          ],
        },
        {
          title: "4.2 Règlement et retard de paiement",
          blocks: [
            plainParagraph(
              "Les paiements peuvent être effectués par virement bancaire, chèque ou carte bancaire. Sauf disposition contraire, le règlement intégral de la formation est exigible avant le démarrage de la session.",
            ),
            plainParagraph(
              "Tout retard de paiement à l'échéance entraînera de plein droit l'application de pénalités de retard égales à 3 fois le taux d'intérêt légal en vigueur, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 euros.",
            ),
          ],
        },
      ],
    },
    {
      title: "5. Conditions d'annulation et de report",
      subsections: [
        {
          title: "5.1 Annulation par le client",
          blocks: [
            {
              type: "list",
              items: [
                listItem(
                  inline("Plus de 30 jours ouvrés", { bold: true }),
                  inline(
                    " avant le début : remboursement intégral des sommes versées ou report sans frais sur une session ultérieure.",
                  ),
                ),
                listItem(
                  inline("Entre 30 et 15 jours ouvrés", { bold: true }),
                  inline(
                    " avant le début : retenue de 30 % du coût total de la formation, ou report selon disponibilités.",
                  ),
                ),
                listItem(
                  inline("Moins de 15 jours ouvrés", { bold: true }),
                  inline(" avant le début : retenue de 50 % du coût total de la formation."),
                ),
                listItem(
                  inline("Absence ou abandon en cours", { bold: true }),
                  inline(
                    " : toute formation commencée est due en totalité. En cas d'absence non justifiée par un cas de force majeure, le montant intégral de la formation reste acquis à l'organisme.",
                  ),
                ),
              ],
            },
          ],
        },
        {
          title: "5.2 Annulation par l'organisme",
          blocks: [
            plainParagraph(
              "LT PROTECT FORMATION se réserve le droit d'annuler ou de reporter une session de formation si le nombre de participants est insuffisant ou en cas de force majeure. Dans ce cas, les sommes versées seront intégralement remboursées ou la formation sera reprogrammée à une date ultérieure, sans indemnité supplémentaire.",
            ),
          ],
        },
        {
          title: "5.3 Droit de rétractation",
          blocks: [
            plainParagraph(
              "Pour les particuliers, un délai de rétractation de 10 jours (contrat classique) ou de 14 jours (vente à distance) est applicable à compter de la signature du contrat, conformément aux dispositions du Code du Travail et du Code de la Consommation.",
            ),
          ],
        },
      ],
    },
    {
      title: "6. Obligations de l'organisme de formation",
      blocks: [
        plainList([
          "Réaliser la prestation de formation conformément au programme établi et aux règles de l'art.",
          "Mettre à disposition des moyens pédagogiques et techniques adaptés (salles de cours, matériel de projection, équipements de sécurité pour les exercices pratiques).",
          "Recourir à des formateurs qualifiés et compétents dans leurs domaines d'intervention.",
          "Assurer le suivi administratif : émission de la convention/contrat, convocations, gestion des feuilles d'émargement, délivrance des attestations de fin de formation et, le cas échéant, des diplômes ou certifications obtenus.",
        ]),
      ],
    },
    {
      title: "7. Obligations du client et du stagiaire",
      blocks: [
        plainParagraph(
          "Le client s'engage à transmettre à LT PROTECT FORMATION toutes les informations nécessaires à la bonne exécution de la formation (coordonnées des stagiaires, prérequis éventuels vérifiés, etc.).",
        ),
        plainParagraph("Le stagiaire est tenu :"),
        plainList([
          "D'assister à la formation avec assiduité et ponctualité.",
          "De signer les feuilles d'émargement par demi-journée.",
          "De respecter le matériel et les locaux mis à disposition.",
          "D'avoir un comportement respectueux envers le personnel de l'organisme et les autres stagiaires.",
        ]),
      ],
    },
    {
      title: "8. Règlement intérieur",
      blocks: [
        plainParagraph(
          "Un Règlement Intérieur est établi par LT PROTECT FORMATION. Il définit les principales règles applicables en matière d'hygiène, de sécurité et de discipline.",
        ),
        plainParagraph(
          "Ce règlement est remis à chaque stagiaire avant toute inscription définitive. L'acceptation et le respect de ce règlement sont obligatoires pour suivre la formation. Tout manquement grave pourra entraîner une sanction allant de l'avertissement à l'exclusion définitive de la formation, conformément aux procédures décrites dans ledit règlement.",
        ),
      ],
    },
    {
      title: "9. Propriété intellectuelle",
      blocks: [
        plainParagraph(
          "L'ensemble des documents remis ou utilisés au cours de la formation (supports pédagogiques, présentations, exercices, études de cas) constitue des œuvres originales et est la propriété exclusive de LT PROTECT FORMATION ou de ses partenaires.",
        ),
        plainParagraph(
          "Ces documents sont protégés par le droit d'auteur. Ils sont remis aux stagiaires pour un usage strictement personnel dans le cadre de leur formation. Toute reproduction, modification, diffusion ou exploitation commerciale, totale ou partielle, sans autorisation écrite préalable est strictement interdite et pourra faire l'objet de poursuites.",
        ),
      ],
    },
    {
      title: "10. Protection des données personnelles (RGPD)",
      blocks: [
        plainParagraph(
          "LT PROTECT FORMATION collecte et traite les données personnelles des clients et stagiaires dans le strict respect du Règlement Général sur la Protection des Données (RGPD).",
        ),
      ],
      subsections: [
        {
          title: "10.1 Finalités",
          blocks: [
            plainParagraph(
              "Les données collectées sont nécessaires à la gestion administrative, commerciale et pédagogique des formations, ainsi qu'au respect des obligations légales et réglementaires vis-à-vis des organismes de contrôle et certificateurs.",
            ),
          ],
        },
        {
          title: "10.2 Conservation",
          blocks: [
            plainParagraph(
              "Les données sont conservées pour la durée nécessaire à l'exécution du contrat et aux obligations légales (archivage administratif pendant une durée minimale de 3 ans après la fin de la formation).",
            ),
          ],
        },
        {
          title: "10.3 Droits",
          blocks: [
            paragraph(
              inline(
                "Toute personne dispose d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition concernant ses données personnelles. Ces droits peuvent être exercés en contactant notre Délégué à la Protection des Données à l'adresse : ",
              ),
              inline("contact@ltpformation.fr", {
                bold: true,
                href: "mailto:contact@ltpformation.fr",
              }),
              inline("."),
            ),
            plainParagraph(
              "LT PROTECT FORMATION s'engage à mettre en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité des données traitées.",
            ),
          ],
        },
      ],
    },
    {
      title: "11. Responsabilité et assurance",
      blocks: [
        plainParagraph(
          "LT PROTECT FORMATION a souscrit une assurance responsabilité civile professionnelle couvrant les dommages pouvant être causés aux tiers dans le cadre de ses activités de formation.",
        ),
        plainParagraph(
          "La responsabilité de l'organisme ne pourra être engagée qu'en cas de faute prouvée et est limitée aux préjudices directs subis par le client, à l'exclusion de tout préjudice indirect (perte d'exploitation, perte de chance, etc.).",
        ),
        plainParagraph(
          "Le stagiaire (ou son employeur) doit être couvert par une assurance responsabilité civile personnelle pour tous les dommages qu'il pourrait causer à lui-même ou à autrui durant la formation.",
        ),
      ],
    },
    {
      title: "12. Force majeure",
      blocks: [
        plainParagraph(
          "La responsabilité de LT PROTECT FORMATION ne pourra être mise en œuvre si la non-exécution ou le retard dans l'exécution de l'une de ses obligations découle d'un cas de force majeure, au sens de l'article 1218 du Code civil et de la jurisprudence française (catastrophes naturelles, incendies, grèves, épidémies, décisions administratives, etc.).",
        ),
        plainParagraph(
          "En cas de force majeure, l'organisme en informera le client dans les meilleurs délais. La formation pourra être suspendue ou annulée sans qu'aucune indemnité ne puisse être réclamée. Si possible, une reprogrammation sera proposée dès la cessation de l'événement.",
        ),
      ],
    },
    {
      title: "13. Réclamations et médiation",
      blocks: [
        paragraph(
          inline(
            "Toute réclamation doit être adressée par écrit au service administratif de LT PROTECT FORMATION à l'adresse email ",
          ),
          inline("contact@ltpformation.fr", {
            bold: true,
            href: "mailto:contact@ltpformation.fr",
          }),
          inline(
            " ou par courrier postal. L'organisme s'engage à répondre dans un délai de 30 jours.",
          ),
        ),
        plainParagraph(
          "Si le client est un consommateur (particulier) et qu'aucun accord amiable n'a pu être trouvé suite à une réclamation écrite, il a la possibilité de recourir gratuitement à un médiateur de la consommation, conformément aux articles L.612-1 et suivants du Code de la consommation.",
        ),
        paragraph(
          inline(
            "Le client peut également utiliser la plateforme européenne de Règlement en Ligne des Litiges (RLL) accessible à l'adresse : ",
          ),
          inline("https://ec.europa.eu/consumers/odr/", {
            bold: true,
            href: "https://ec.europa.eu/consumers/odr/",
          }),
          inline("."),
        ),
      ],
    },
    {
      title: "14. Droit applicable et juridiction compétente",
      blocks: [
        plainParagraph(
          "Les présentes CGV et les relations contractuelles qui en découlent sont régies par le droit français.",
        ),
        plainParagraph(
          "Elles sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs langues étrangères, seul le texte français ferait foi en cas de litige.",
        ),
        plainParagraph(
          "Si une clause des présentes CGV venait à être déclarée nulle ou non écrite, les autres clauses resteraient pleinement en vigueur.",
        ),
        plainParagraph(
          "À défaut de résolution amiable, tout litige relatif à l'interprétation, la validité ou l'exécution des présentes CGV sera de la compétence exclusive des tribunaux du ressort du siège social de LT PROTECT FORMATION (Tribunal de Versailles), sauf disposition légale impérative contraire.",
        ),
      ],
    },
    {
      title: "15. Modifications",
      blocks: [
        plainParagraph(
          "LT PROTECT FORMATION se réserve le droit de modifier à tout moment les présentes mentions et CGV. Les utilisateurs du site sont invités à les consulter régulièrement.",
        ),
        plainParagraph("Dernière mise à jour : 24/12/2025"),
      ],
    },
  ],
};
