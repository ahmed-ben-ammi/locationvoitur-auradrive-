import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Map, Compass, Building2 } from 'lucide-react';

export default function Destinations() {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'sahara-atlas',
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2067&auto=format&fit=crop", // Sahara
      titleKey: "card1.title",
      descKey: "card1.desc",
      recKey: "card1.recommend",
      Icon: Map
    },
    {
      id: 'coastal-escape',
      image: "https://images.unsplash.com/photo-1577147443647-81856d5151af?q=80&w=2070&auto=format&fit=crop", // Essaouira / Coast
      titleKey: "card2.title",
      descKey: "card2.desc",
      recKey: "card2.recommend",
      Icon: Compass
    },
    {
      id: 'city-explore',
      image: "https://a.loveholidays.com/seo-lvh/content/holidays/morocco-unesco-world-heritage-sites-guide/images/ch1-3.jpg?auto=webp&optimise=true&quality=60", // Marrakech / City
      titleKey: "card3.title",
      descKey: "card3.desc",
      recKey: "card3.recommend",
      Icon: Building2
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            {t('destinations.title')}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <Link to={`/destination/${card.id}`} key={card.id} className="group bg-white dark:bg-[#242424] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={card.image}
                  alt={t(`destinations.${card.titleKey}`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-full shadow-lg">
                    <card.Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide drop-shadow-md">
                    {t(`destinations.${card.titleKey}`)}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                  {t(`destinations.${card.descKey}`)}
                </p>
                <div className="pt-4 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    {t(`destinations.${card.recKey}`)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
