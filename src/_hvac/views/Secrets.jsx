import { SECRET_GROUPS } from '../data/secrets.js';

/*
The whole cheat sheet on one scrollable page, so it can be
read on a phone while lying in a crawlspace. Every item is a
rule plus the reason — the reason is what makes it stick.
*/

export function Secrets() {
    return (
        <div className="secrets">
            {SECRET_GROUPS.map((group) => (
                <section key={group.title} className="secrets__group">
                    <h3>{group.title}</h3>
                    <ol>
                        {group.secrets.map((secret) => (
                            <li key={secret.rule}>
                                <p className="secrets__rule">{secret.rule}</p>
                                <p className="secrets__why">{secret.why}</p>
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    );
}
