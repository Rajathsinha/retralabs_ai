import { Mail, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardBody, Accordion, AccordionItem, Link } from '@heroui/react';
import ScrollReveal from '../components/ScrollReveal';

const FAQ_ITEMS = [
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to most countries. Shipping times and availability may vary based on location and local regulations.',
  },
  {
    q: 'How are products stored and shipped?',
    a: 'All products are stored under controlled conditions and shipped with appropriate cooling measures to maintain stability during transit.',
  },
  {
    q: 'Can I get certificates of analysis?',
    a: 'Yes, certificates of analysis are available upon request for all products. Please contact us with your order details.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <h1 className="section-heading mb-4">Contact Us</h1>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl">
            We're here to assist with your research needs. Our team typically responds within 24 hours.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            {
              icon: Mail,
              title: 'Email Support',
              desc: 'Send us a detailed inquiry',
              link: 'mailto:support@retralabs.in',
              linkText: 'support@retralabs.in',
              color: 'bg-blue-50 border-blue-100',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
            },
            {
              icon: MessageSquare,
              title: 'WhatsApp',
              desc: 'Quick questions & real-time support',
              link: 'https://wa.me/918217824384?text=Hello%2C%20I%20came%20across%20your%20website%20RetraLabs',
              linkText: '+91 8217824384',
              color: 'bg-emerald-50 border-emerald-100',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600',
            },
            {
              icon: Clock,
              title: 'Response Time',
              desc: 'We respond within 24 hours on business days',
              link: '',
              linkText: '',
              color: 'bg-amber-50 border-amber-100',
              iconBg: 'bg-amber-100',
              iconColor: 'text-amber-600',
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <Card shadow="none" classNames={{ base: `border ${item.color}` }} className="card-hover">
                <CardBody className="p-6">
                  <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{item.desc}</p>
                  {item.link && (
                    <Link href={item.link} color="primary" className="text-sm font-semibold">
                      {item.linkText}
                    </Link>
                  )}
                </CardBody>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <Accordion variant="bordered">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} title={item.q} classNames={{ title: 'font-semibold text-slate-900' }}>
                  <p className="text-slate-600 leading-relaxed pb-2">{item.a}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Important Notice</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                All products are strictly for research use only. We do not provide medical advice or support
                any use outside of laboratory research environments.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
